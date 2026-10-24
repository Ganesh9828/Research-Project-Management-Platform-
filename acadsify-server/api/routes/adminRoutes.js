import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// Admin route to map users by interests
router.post('/assign-students-to-teachers', adminController.assignStudentsToTeachers); // Corrected endpoint path

// Add new route for matching results
router.get('/matching-results', adminController.getMatchingResults);

// Admin route to create user via Admin SDK
router.post('/create-user', adminController.createUserViaAdminSDK);

// Removed the /matching route as it caused errors due to undefined handler
// router.get('/matching', (req, res) => {
//     res.send("Domain Matching System");
// });

export default router;
