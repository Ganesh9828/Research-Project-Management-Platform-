import express from 'express';
import {
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses
} from '../controllers/courseController.js';

const router = express.Router();

// Route to create a new course
router.post('/', createCourse);

// Route to update an existing course
router.put('/:courseId', updateCourse);

// Route to delete a course
router.delete('/:courseId', deleteCourse);

// Route to get all courses
router.get('/', getAllCourses);

export default router;
