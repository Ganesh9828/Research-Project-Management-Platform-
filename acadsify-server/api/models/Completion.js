import mongoose from 'mongoose';

const completionSchema = new mongoose.Schema({
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
    completionDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['completed', 'in-progress'],
        default: 'in-progress'
    }
});

const Completion = mongoose.model('Completion', completionSchema);

export default Completion;
