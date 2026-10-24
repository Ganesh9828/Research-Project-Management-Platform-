import User from '../models/User.js';
import Course from '../models/Course.js'; // Import Course model
import Appointment from '../models/Appointment.js'; // Import Appointment model
import Engagement from '../models/Engagement.js'; // Import Engagement model
import Completion from '../models/Completion.js'; // Import Completion model

// Function to get enhanced analytics data
export const getAnalyticsData = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments(); // Retrieve actual data for total courses
        const totalAppointments = await Appointment.countDocuments(); // Retrieve actual data for total appointments
        const totalEngagements = await Engagement.countDocuments(); // Retrieve total user engagements
        const totalCompletions = await Completion.countDocuments(); // Retrieve total course completions

        return {
            totalUsers,
            totalCourses,
            totalAppointments,
            totalEngagements,
            totalCompletions,
        };
    } catch (error) {
        console.error('Error fetching enhanced analytics data:', error);
        throw new error('Failed to fetch enhanced analytics data');
    }
};
