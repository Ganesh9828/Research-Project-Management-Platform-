import Notification from '../models/Notification.js'; // Import the Notification model

export const notifyStudents = async (mappings) => {
    try {
        for (const teacherId in mappings.teachers) {
            const studentIds = mappings.teachers[teacherId].studentIds;
            for (const studentId of studentIds) {
                const notification = new Notification({
                    userId: studentId,
                    message: `You have been assigned to teacher with ID: ${teacherId}`,
                    read: false,
                });
                await notification.save(); // Save the notification to the database
            }
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
};

// Fetch all notifications

export const fetchNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId }); // Assuming notifications are linked to userId
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
