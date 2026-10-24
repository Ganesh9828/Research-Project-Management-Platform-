import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';

// Function to submit an assignment
export const submitAssignment = async (req, res) => {
    const { assignmentId, fileUrl } = req.body;
    const studentId = req.userId; // Assuming userId is set by verifyToken middleware

    try {
        // Check if the assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Create a new submission
        const submission = new Submission({
            assignment_id: assignmentId,
            student_id: studentId,
            file_url: fileUrl,
            submitted_at: new Date().toISOString(),
        });

        await submission.save();

        res.status(201).json({ message: 'Assignment submitted successfully' });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
