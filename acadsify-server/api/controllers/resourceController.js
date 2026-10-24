import Course from '../models/Course.js';

// Function to get resources for a course
export const getResources = async (req, res) => {
    const { courseId } = req.params; // Assuming courseId is passed as a URL parameter

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course.materials); // Return the materials associated with the course
    } catch (error) {
        console.error('Error fetching course resources:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
