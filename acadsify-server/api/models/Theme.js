import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    colors: {
        primary: {
            type: String,
            required: true,
        },
        secondary: {
            type: String,
            required: true,
        },
    },
    fonts: {
        type: String,
        required: true,
    },
});

// Create a Theme model from the schema
const Theme = mongoose.model('Theme', themeSchema);

export default Theme;
