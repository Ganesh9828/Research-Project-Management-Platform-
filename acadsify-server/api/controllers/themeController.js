import Theme from '../models/Theme.js'; // Assuming a Theme model exists

// Function to update theme settings
export const updateTheme = async (req, res) => {
    const { colors, typography, layout } = req.body;

    try {
        // Logic to update theme settings in the database
        const updatedTheme = await Theme.findOneAndUpdate({}, { colors, typography, layout }, { new: true, upsert: true });
        res.status(200).json(updatedTheme);
    } catch (error) {
        console.error('Error updating theme:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to fetch current theme settings
export const getTheme = async (req, res) => {
    try {
        const theme = await Theme.findOne();
        res.status(200).json(theme);
    } catch (error) {
        console.error('Error fetching theme:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
