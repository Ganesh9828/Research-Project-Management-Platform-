import mongoose from 'mongoose';

const engagementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    engagementTime: {
        type: Number,
        required: true
    },
    engagementDate: {
        type: Date,
        default: Date.now
    }
});

const Engagement = mongoose.model('Engagement', engagementSchema);

export default Engagement;
