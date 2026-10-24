
import admin from "firebase-admin";
import User from '../models/User.js';

import fs from 'fs';
import path from 'path';
import { TfidfVectorizer } from '../services/tfidfService.js';
import { notifyStudents } from '../services/notificationService.js';

const cosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) return 0;

  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

const hungarianAlgorithm = (costMatrix) => {
  for (let i = 0; i < costMatrix.length; i++) {
    const min = Math.min(...costMatrix[i]);
    costMatrix[i] = costMatrix[i].map(val => val - min);
  }

  for (let j = 0; j < costMatrix[0].length; j++) {
    const col = costMatrix.map(row => row[j]);
    const min = Math.min(...col);
    costMatrix.forEach(row => row[j] -= min);
  }

  const assignments = [];
  const teacherCounts = new Array(costMatrix[0].length).fill(0);
  const maxStudents = 4;

  costMatrix.forEach((row, studentIdx) => {
    const teacherIdx = row.indexOf(Math.min(...row));
    if (teacherCounts[teacherIdx] < maxStudents) {
      assignments.push([studentIdx, teacherIdx]);
      teacherCounts[teacherIdx]++;
    }
  });

  return assignments;
};



import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  let serviceAccount = {};
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const serviceAccountPath = resolve(__dirname, '../acadsify-7d6dd-firebase-adminsdk-fbsvc-e5745c512d.json');
    const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(fileContent);
  } catch (err) {
    console.error('Failed to load Firebase service account credentials:', err);
    throw new Error('Invalid Firebase service account credentials');
  }

  if (!serviceAccount.project_id || typeof serviceAccount.project_id !== 'string') {
    console.error('Firebase service account is missing required "project_id" property:', serviceAccount);
    throw new Error('Service account object must contain a string "project_id" property.');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


// Helper function to flatten interests
const flattenInterests = (interests) => {
  const flattened = [];
  for (const domain in interests) {
    if (interests.hasOwnProperty(domain)) {
      const subdomains = interests[domain];
      for (const subdomain of subdomains) {
        flattened.push(`${domain} - ${subdomain}`);
      }
    }
  }
  return flattened;
};

// Function to get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to delete a user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to create user via Firebase Admin SDK
export const createUserViaAdminSDK = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    res.status(201).json(userRecord);
  } catch (error) {
    console.error('Error creating user via Admin SDK:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to assign students to teachers using Hungarian algorithm
export const assignStudentsToTeachers = async (req, res) => {
  try {
    console.log('[assignStudentsToTeachers] Start processing');

    // Fetch teachers and students from DB
    const teachers = await User.find({ role: 'teacher' }).lean();
    const students = await User.find({ role: 'student' }).lean();
    console.log(`[assignStudentsToTeachers] Teachers count: ${teachers.length}, Students count: ${students.length}`);

    // Prepare text data for vectorization
    const teacherTexts = teachers.map(t => flattenInterests(t.interests || {}).join(' '));
    const studentTexts = students.map(s => flattenInterests(s.interests || {}).join(' '));
    console.log(`[assignStudentsToTeachers] Sample teacher text: ${teacherTexts[0] || 'N/A'}`);
    console.log(`[assignStudentsToTeachers] Sample student text: ${studentTexts[0] || 'N/A'}`);

    // Vectorize interests using TF-IDF
    const vectorizer = new TfidfVectorizer();
    const allTexts = teacherTexts.concat(studentTexts);
    const tfidfMatrix = vectorizer.fitTransform(allTexts);
    console.log(`[assignStudentsToTeachers] TF-IDF matrix length: ${tfidfMatrix.length}`);

    const teacherVectors = tfidfMatrix.slice(0, teachers.length);
    const studentVectors = tfidfMatrix.slice(teachers.length);

    // Compute cosine similarity matrix manually
    const similarityMatrix = studentVectors.map(studentVec =>
      teacherVectors.map(teacherVec => cosineSimilarity(studentVec, teacherVec))
    );
    console.log(`[assignStudentsToTeachers] Similarity matrix size: ${similarityMatrix.length} x ${similarityMatrix[0]?.length}`);

    // Expand teacher slots (assuming max 4 students per teacher)
    const slotsPerTeacher = 4;
    const expandedTeacherVectors = [];
    for (const vec of teacherVectors) {
      for (let i = 0; i < slotsPerTeacher; i++) {
        expandedTeacherVectors.push(vec);
      }
    }
    console.log(`[assignStudentsToTeachers] Expanded teacher vectors count: ${expandedTeacherVectors.length}`);

    // Compute expanded similarity matrix manually
    const expandedSimilarityMatrix = studentVectors.map(studentVec =>
      expandedTeacherVectors.map(teacherVec => cosineSimilarity(studentVec, teacherVec))
    );
    console.log(`[assignStudentsToTeachers] Expanded similarity matrix size: ${expandedSimilarityMatrix.length} x ${expandedSimilarityMatrix[0]?.length}`);

    // Convert similarity to cost matrix for Hungarian algorithm
    const costMatrix = expandedSimilarityMatrix.map(row => row.map(val => -val));
    console.log('[assignStudentsToTeachers] costMatrix size:', costMatrix.length, 'x', costMatrix[0]?.length);

    // Apply Hungarian algorithm
    const assignmentsArray = hungarianAlgorithm(costMatrix);
    console.log('[assignStudentsToTeachers] assignmentsArray:', assignmentsArray);

    // Map assignments back to original teacher IDs
    const assignments = {};
    for (const [studentIdx, expandedTeacherIdx] of assignmentsArray) {
      const originalTeacherIdx = Math.floor(expandedTeacherIdx / slotsPerTeacher);
      const teacherId = teachers[originalTeacherIdx]._id.toString();
      const studentId = students[studentIdx]._id.toString();
      if (!assignments[teacherId]) {
        assignments[teacherId] = [];
      }
      assignments[teacherId].push(studentId);
    }
    console.log('[assignStudentsToTeachers] assignments:', assignments);

    // Fix: notifyStudents expects an array of objects with teacherId and studentIds
    const notifyData = Object.entries(assignments).map(([teacherId, studentIds]) => ({
      teacherId,
      studentIds,
    }));

    // Send notifications and emails to students about their assignments
    await notifyStudents(notifyData);
    console.log('[assignStudentsToTeachers] Notifications sent to students');

    // Send emails to teachers with their assigned students list
    for (const [teacherId, studentIds] of Object.entries(assignments)) {
      try {
        const teacher = teachers.find(t => t._id.toString() === teacherId);
        if (!teacher || !teacher.email) continue;

        // Fetch student details for email content
        const assignedStudents = students.filter(s => studentIds.includes(s._id.toString()));

        const studentListHtml = assignedStudents.map(s => `<li>${s.fullName || s.email}</li>`).join('');
        const studentListText = assignedStudents.map(s => s.fullName || s.email).join(', ');

        await sendEmail({
          to: teacher.email,
          subject: 'Your Assigned Students List',
          text: `You have been assigned the following students: ${studentListText}`,
          html: `<p>You have been assigned the following students:</p><ul>${studentListHtml}</ul>`
        });
        console.log(`[assignStudentsToTeachers] Email sent to teacher ${teacher.email}`);
      } catch (emailError) {
        console.error(`Failed to send email to teacher ${teacherId}:`, emailError);
      }
    }

    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error assigning students to teachers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};






import { matchStudentsToTeachers } from '../services/hungarianMatchingService.js';

// Function to get matching results
export const getMatchingResults = async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find().lean();
    console.log(`[getMatchingResults] Total users fetched: ${users.length}`);

    // Get assignments from matching service
    const assignments = await matchStudentsToTeachers(users);
    console.log(`[getMatchingResults] Assignments received: ${JSON.stringify(assignments, null, 2)}`);

    // Map teacherId to teacher profile and collect assigned students
    const teacherMap = {};
    const studentMap = {};

    users.forEach(user => {
      if (user.role === 'teacher') {
        teacherMap[user._id.toString()] = user;
      } else if (user.role === 'student') {
        studentMap[user._id.toString()] = user;
      }
    });

    console.log(`[getMatchingResults] Teachers count: ${Object.keys(teacherMap).length}, Students count: ${Object.keys(studentMap).length}`);

    // Group students by teacher
    const resultsMap = {};
    assignments.forEach(({ teacherId, studentId }) => {
      // Only include if teacher and student exist
      if (teacherMap[teacherId] && studentMap[studentId]) {
        if (!resultsMap[teacherId]) {
          resultsMap[teacherId] = {
            teacher: teacherMap[teacherId],
            students: [],
          };
        }
        resultsMap[teacherId].students.push(studentMap[studentId]);
      }
    });

    // Convert results map to array
    const resultsArray = Object.values(resultsMap);
    console.log(`[getMatchingResults] Results array length: ${resultsArray.length}`);

    res.status(200).json(resultsArray);
  } catch (error) {
    console.error('Error getting matching results:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const performMatching = async (req, res) => {
  try {
    // Fetch teachers and students from DB
    const teachers = await User.find({ role: 'teacher' }).lean();
    const students = await User.find({ role: 'student' }).lean();
    console.log(`[performMatching] Teachers fetched: ${teachers.length}, Students fetched: ${students.length}`);

    // Prepare text data for vectorization
    const teacherTexts = teachers.map(t => flattenInterests(t.interests || {}).join(' '));
    const studentTexts = students.map(s => flattenInterests(s.interests || {}).join(' '));
    console.log(`[performMatching] Teacher texts sample: ${teacherTexts.slice(0,1)}`);
    console.log(`[performMatching] Student texts sample: ${studentTexts.slice(0,1)}`);

    // Vectorize interests using TF-IDF
    const vectorizer = new TfidfVectorizer();
    const allTexts = teacherTexts.concat(studentTexts);
    const tfidfMatrix = vectorizer.fitTransform(allTexts);
    console.log(`[performMatching] TF-IDF matrix size: ${tfidfMatrix.length}`);

    const teacherVectors = tfidfMatrix.slice(0, teachers.length);
    const studentVectors = tfidfMatrix.slice(teachers.length);

    // Compute cosine similarity matrix
    const similarityMatrix = cosineSimilarity(studentVectors, teacherVectors);
    console.log(`[performMatching] Similarity matrix size: ${similarityMatrix.length} x ${similarityMatrix[0]?.length}`);

    // Expand teacher slots (assuming max 4 students per teacher)
    const slotsPerTeacher = 4;
    const expandedTeacherVectors = [];
    for (const vec of teacherVectors) {
      for (let i = 0; i < slotsPerTeacher; i++) {
        expandedTeacherVectors.push(vec);
      }
    }
    const expandedSimilarityMatrix = cosineSimilarity(studentVectors, expandedTeacherVectors);
    console.log(`[performMatching] Expanded similarity matrix size: ${expandedSimilarityMatrix.length} x ${expandedSimilarityMatrix[0]?.length}`);

    // Convert similarity to cost matrix for Hungarian algorithm
    const costMatrix = expandedSimilarityMatrix.map(row => row.map(val => -val));

    // Apply Hungarian algorithm
    const assignmentsArray = hungarianAlgorithm(costMatrix);
    console.log(`[performMatching] Assignments array: ${JSON.stringify(assignmentsArray)}`);

    // Map assignments back to original teacher IDs
    const assignments = {};
    for (const [studentIdx, expandedTeacherIdx] of assignmentsArray) {
      const originalTeacherIdx = Math.floor(expandedTeacherIdx / slotsPerTeacher);
      const teacherId = teachers[originalTeacherIdx]._id.toString();
      const studentId = students[studentIdx]._id.toString();
      if (!assignments[teacherId]) {
        assignments[teacherId] = [];
      }
      assignments[teacherId].push(studentId);
    }

    // Optionally, update DB with assignments here

    res.status(200).json({ assignments });
  } catch (error) {
    console.error('Error performing matching:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
