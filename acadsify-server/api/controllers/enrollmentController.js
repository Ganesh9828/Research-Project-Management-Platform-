import Course from '../models/Course.js';
import User from '../models/User.js';

// Function to enroll a student in a course
export const enrollInCourse = async (req, res) => {
    const { courseId } = req.body;
    const studentId = req.userId; // Assuming userId is set by verifyToken middleware

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Add the student to the course's enrolled students
        course.enrolledStudents.push(studentId);
        await course.save();

        res.status(200).json({ message: 'Successfully enrolled in course', course });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to get all courses for enrollment
export const getCoursesForEnrollment = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
