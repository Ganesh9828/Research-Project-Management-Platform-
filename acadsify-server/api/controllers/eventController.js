import Event from '../models/Event.js'; // Import an Event model

// Function to fetch upcoming events
export const fetchUpcomingEvents = async (req, res) => {
    try {
        const events = await Event.find({ date: { $gte: new Date() } }); // Fetch events with a date greater than or equal to today
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to fetch system load metrics
export const fetchSystemLoad = async (req, res) => {
    // Example metrics; this should be replaced with actual monitoring logic if available
    const metrics = {
        uptime: '99.9%', // Mock data
        responseTime: '120ms', // Mock data
        storageUsed: '45%', // Mock data
    };

    res.status(200).json(metrics);
};
