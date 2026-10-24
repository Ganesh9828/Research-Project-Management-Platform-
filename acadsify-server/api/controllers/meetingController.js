import Meeting from '../models/Meeting.js'; // Import the Meeting model

// Fetch all meetings
export const fetchMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find({ userId: req.userId }); // Assuming meetings are linked to userId
        res.status(200).json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Schedule a meeting
export const scheduleMeeting = async (req, res) => {
    const { date, time } = req.body;
    try {
        const newMeeting = new Meeting({ userId: req.userId, date, time });
        await newMeeting.save();
        res.status(201).json({ message: 'Meeting scheduled successfully' });
    } catch (error) {
        console.error('Error scheduling meeting:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get a specific meeting
export const getMeetingById = async (req, res) => {
    const { id } = req.params;
    try {
        const meeting = await Meeting.findById(id);
        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }
        res.status(200).json(meeting);
    } catch (error) {
        console.error('Error fetching meeting:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
