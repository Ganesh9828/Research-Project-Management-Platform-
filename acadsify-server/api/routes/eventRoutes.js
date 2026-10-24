import express from 'express';
import { fetchUpcomingEvents, fetchSystemLoad } from '../controllers/eventController.js';

const router = express.Router();

// Route to fetch upcoming events
router.get('/upcoming-events', fetchUpcomingEvents);

// Route to fetch system load metrics
router.get('/system-load', fetchSystemLoad);

export default router;
