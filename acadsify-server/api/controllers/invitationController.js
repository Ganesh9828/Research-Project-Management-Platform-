import User from '../models/User.js';
import crypto from 'crypto'; // For token generation
import nodemailer from 'nodemailer'; // For sending emails

// Send teacher invitation
export const sendTeacherInvitation = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const token = crypto.randomBytes(20).toString('hex'); // Generate a secure token
        const expiry = Date.now() + 3600000; // Token valid for 1 hour

        // Save the token and expiry to the user model
        await User.updateOne({ email }, { invitationToken: token, tokenExpiry: expiry });

        // Set up email transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS // Your email password
            }
        });

        // Send invitation email
        const mailOptions = {
            to: email,
            subject: 'Teacher Invitation',
            text: `You have been invited to become a teacher. Please click the following link to accept the invitation: 
            http://yourdomain.com/accept-invitation/${token}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error) {
        console.error('Error sending invitation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
