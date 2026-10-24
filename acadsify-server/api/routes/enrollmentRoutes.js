import express from 'express';
import { enrollInCourse, getCoursesForEnrollment } from '../controllers/enrollmentController.js';

const router = express.Router();

// Route to enroll in a course
router.post('/enroll', enrollInCourse);

// Route to get all courses for enrollment
router.get('/', getCoursesForEnrollment);

export default router;
