import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import dotenv from 'dotenv';
import User from '../models/User.js'; // Ensure User model is imported

dotenv.config(); // Load environment variables from .env file

export const createUser = async (req, res) => {
    const { email, password, fullName, role, firebaseUID } = req.body;

    if (!email || !password || !fullName || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            email, 
            password: hashedPassword, 
            fullName, 
            role, 
            firebaseUID,
            domains: [],
            maxStudents: role === 'teacher' ? 4 : undefined,
            assignedStudents: [],
            assignedTeacher: null
        });
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error('Error saving user to MongoDB:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

import { matchStudentsToTeachers } from '../services/hungarianMatchingService.js';

export const assignStudentsToTeachers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        const results = await matchStudentsToTeachers(users); // Use the enhanced matching service

        // Process the results to update the database
        for (const { studentId, teacherId } of results) {
            // Check if the teacher is available before assigning
            const teacher = await User.findById(teacherId);
            if (teacher && teacher.availability) {
                await User.findByIdAndUpdate(studentId, { assignedTeacher: teacherId });
                await User.findByIdAndUpdate(teacherId, { $addToSet: { assignedStudents: studentId } });
            }
        }

        return res.status(200).json({ message: 'Assignments completed successfully', results });

    } catch (error) {
        console.error('Error assigning students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    const { userId } = req.params; // Get userId from params
    const updates = req.body; // Get updates from request body

    try {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true }); // Update user by userId
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user); // Return the updated user
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.json(users); // Return the list of users
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    const { userId } = req.params; // Get userId from params
    try {
        const user = await User.findByIdAndDelete(userId); // Delete user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Function to save user interests

export const saveUserInterests = async (req, res) => {
    const { firebaseUID } = req.params;
    const { interests } = req.body;
  
    try {
      const user = await User.findOneAndUpdate(
        { firebaseUID },
        { $set: { interests } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'Interests updated successfully', user });
    } catch (error) {
      console.error('Error saving interests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// New controller method to get authenticated user's profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId; // Set by verifyToken middleware
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
