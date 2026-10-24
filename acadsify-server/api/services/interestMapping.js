import KMeans from 'ml-kmeans'; // Importing KMeans clustering algorithm
import { notifyStudents } from './notificationService.js'; // Ensure notification service is imported

// Function to map interests using KMeans clustering
export const mapInterests = async (users) => {
    const interests = users.map(user => user.interests || []); // Extract interests from users, default to empty array if undefined

    // Create separate arrays for teachers and students
    const teachers = users.filter(user => user.role === 'teacher');
    const students = users.filter(user => user.role === 'student');

    const kmeans = new KMeans({ maxIter: 100 }); // Set maximum iterations for KMeans

    const clusters = kmeans.cluster(interests, { k: Math.min(3, users.length) }); // Dynamic clustering based on user count

    // Logic to create a mapping of students to teachers based on clusters
    const mappings = { teachers: {}, students: {} }; // Initialize separate mappings for teachers and students

    clusters.forEach((cluster) => {
        cluster.forEach(userIndex => {
            const user = users[userIndex];
            if (!mappings.teachers[user.id] && user.role === 'teacher') { 
                mappings.teachers[user.id] = { studentIds: [] }; // Initialize mapping structure for teachers
            } else if (!mappings.students[user.id] && user.role === 'student') {
                mappings.students[user.id] = { teacherIds: [] }; // Initialize mapping structure for students
            }

            // Check if the user is a teacher
            if (teachers.includes(user)) { 
                mappings.teachers[user.id].studentIds.push(user.id); // Map students to their respective teachers
            } else if (students.includes(user)) { // Check if the user is a student
                mappings.students[user.id].teacherIds.push(user.id); // Map teachers to their respective students
            }
        });
    });

    // Notify students about their assigned teachers
    await notifyStudents(mappings); 
    return mappings; 
};
