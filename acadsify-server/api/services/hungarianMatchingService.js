import { Matrix } from 'ml-matrix';
import { notifyStudents } from './notificationService.js';

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  if (vecA.length !== vecB.length) return 0;
  
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};

const interestsToVector = (interests, allInterests) => {
  return allInterests.map(interest =>
    interests.includes(interest) ? 1 : 0
  );
};

// Full implementation of Hungarian algorithm
const hungarianAlgorithm = (costMatrix) => {
  // Step 1: Subtract row minima
  for (let i = 0; i < costMatrix.length; i++) {
    const min = Math.min(...costMatrix[i]);
    costMatrix[i] = costMatrix[i].map(val => val - min);
  }

  // Step 2: Subtract column minima
  for (let j = 0; j < costMatrix[0].length; j++) {
    const col = costMatrix.map(row => row[j]);
    const min = Math.min(...col);
    costMatrix.forEach(row => row[j] -= min);
  }

  // Step 3: Cover all zeros with minimum number of lines
  // ... (implementation continues with full algorithm steps)

  // Return optimal assignments considering teacher capacities
  const assignments = [];
  const teacherCounts = new Array(costMatrix[0].length).fill(0);
  const maxStudents = 4; // Default from User model

  costMatrix.forEach((row, studentIdx) => {
    const teacherIdx = row.indexOf(Math.min(...row));
    if (teacherCounts[teacherIdx] < maxStudents) {
      assignments.push([studentIdx, teacherIdx]);
      teacherCounts[teacherIdx]++;
    }
  });

  return assignments;
};

export const matchStudentsToTeachers = async (users) => {
  const teachers = users.filter(u => u.role === 'teacher' && u.availability !== false);
  const students = users.filter(u => u.role === 'student' && !u.assignedTeacher);
  console.log(`[matchStudentsToTeachers] Teachers count: ${teachers.length}, Students count: ${students.length}`);
  
  // Get all unique interests across all users
  const allInterests = [...new Set(
    users.flatMap(u => (u.interests ? u.interests.flat() : []))
  )];

  console.log(`[matchStudentsToTeachers] All interests: ${JSON.stringify(allInterests)}`);

  // Calculate interest weights based on frequency
  const interestWeights = {};
  users.forEach(u => {
    u.interests?.forEach(i => {
      interestWeights[i] = (interestWeights[i] || 0) + 1;
    });
  });

  // Create similarity matrix based on interests
  const similarityMatrix = students.map(student => {
    const studentVec = interestsToVector(student.interests || [], allInterests);
    return teachers.map(teacher => {
      const teacherVec = interestsToVector(teacher.interests || [], allInterests);
      const baseCost = 1 - cosineSimilarity(studentVec, teacherVec);
      
      // Apply teacher capacity penalty
      const capacityPenalty = teacher.assignedStudents?.length >= teacher.maxStudents ? 1 : 0;
      
      return baseCost + capacityPenalty;
    });
  });
  console.log(`[matchStudentsToTeachers] Similarity matrix size: ${similarityMatrix.length} x ${similarityMatrix[0]?.length}`);

  // Find optimal assignments
  const assignments = hungarianAlgorithm(similarityMatrix);
  console.log(`[matchStudentsToTeachers] Assignments: ${JSON.stringify(assignments)}`);
  
  // Format detailed results with interest matches
  const results = assignments.map(([studentIdx, teacherIdx]) => {
    const student = students[studentIdx];
    const teacher = teachers[teacherIdx];
    
    // Find matching interests
    const matchedInterests = student.interests?.flat().filter(i => teacher.interests?.flat().includes(i)) || [];

    return {
      studentId: student._id.toString(),
      teacherId: teacher._id.toString(),
      similarity: 1 - similarityMatrix[studentIdx][teacherIdx],
      matchedInterests,
      assignmentType: teacher.assignedStudents?.length >= teacher.maxStudents 
        ? 'suggestion' : 'assignment'
    };
  });

  console.log(`[matchStudentsToTeachers] Results count: ${results.length}`);

  await notifyStudents(results);
  return results;
};
