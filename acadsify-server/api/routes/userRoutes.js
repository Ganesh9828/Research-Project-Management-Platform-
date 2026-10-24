import express from 'express';
import { signup, getUserRole } from '../controllers/authController.js'; 
import User from '../models/User.js'; 
import { createUser, updateUser, saveUserInterests, getUserProfile } from '../controllers/userControllers.js'; // Import getUserProfile

import {
    getAllUsers,
    updateUserRole,
    deleteUser,
    createUserViaAdminSDK,
    assignStudentsToTeachers,
    getMatchingResults

} from '../controllers/adminController.js'; 



import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/add-user', createUser); 
router.put('/:userId', updateUser); 

// Route to get all users
router.get('/users', getAllUsers);

// New route to get authenticated user's profile
router.get('/users/profile', verifyToken, getUserProfile);

// Route to get user role by firebaseUID
router.get('/:firebaseUID', getUserRole);

// New route for admin user creation via Firebase Admin SDK
router.post('/admin/create-user', createUserViaAdminSDK);

router.post('/:firebaseUID', saveUserInterests); // New route for saving user interests

// Route to delete a user
router.delete('/users/:userId', deleteUser);

// Route to assign students to teachers
router.post('/assign-students', assignStudentsToTeachers);

console.log("User Routes Loaded");

router.get('/', async (req, res) => {
    const users = await User.find(); 
    res.json(users);
});

export default router;
