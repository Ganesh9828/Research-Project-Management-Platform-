import express from 'express';
import { updateTheme, getTheme } from '../controllers/themeController.js';

const router = express.Router();

// Route to update theme settings
router.put('/', updateTheme);

// Route to fetch current theme settings
router.get('/', getTheme);

export default router;
