import Notification from '../models/Notification.js'; // Import Notification model
import { sendEmail } from './emailService.js'; // Import email sending service

// Function to notify students about their assigned teachers
export const notifyStudents = async (mappings) => {
    for (const teacherId in mappings.teachers) {
        const teacher = mappings.teachers[teacherId];
        for (const studentId of teacher.studentIds) {
            // Create a notification for each student
            const notification = new Notification({
                userId: studentId,
                message: `You have been assigned to work with teacher ID: ${teacherId}.`,
                type: 'assignment'
            });
            await notification.save(); // Save the notification to the database

            // Send email notification to the student
            try {
                // Assuming you have a way to get student's email by their ID
                // For example, fetch user email from database here (pseudo code)
                // const student = await User.findById(studentId);
                // const email = student.email;

                // For demonstration, let's assume a function getUserEmail(studentId) exists
                const email = await getUserEmail(studentId);

                if (email) {
                    await sendEmail({
                        to: email,
                        subject: 'New Teacher Assignment',
                        text: `You have been assigned to work with teacher ID: ${teacherId}.`,
                        html: `<p>You have been assigned to work with teacher ID: <strong>${teacherId}</strong>.</p>`
                    });
                }
            } catch (error) {
                console.error(`Failed to send email to student ID ${studentId}:`, error);
            }
        }
    }
};

// Placeholder function to get user email by ID - replace with actual implementation
async function getUserEmail(userId) {
    // This function should query the User model or database to get the email address
    // For now, return a dummy email or throw error
    // throw new Error('getUserEmail function not implemented');
    return 'student@example.com'; // Replace with real email fetching logic
}
