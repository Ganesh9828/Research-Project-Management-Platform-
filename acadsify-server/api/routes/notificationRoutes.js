import express from 'express';
const router = express.Router();

// Example route for fetching notifications
router.get('/', async (req, res) => {
    // Logic to fetch notifications
    res.send('Fetch notifications');
});

// Example route for marking a notification as read
router.post('/:id/read', async (req, res) => {
    // Logic to mark a notification as read
    res.send('Mark notification as read');
});

export default router;
