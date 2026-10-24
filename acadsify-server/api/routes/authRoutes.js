import express from 'express';
import { signup } from '../controllers/authController.js';

const router = express.Router();

// Correct Signup Route
router.post('/signup', signup);


export default router;
