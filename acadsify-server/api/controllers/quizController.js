import Quiz from '../models/Quiz.js';
import User from '../models/User.js'; // Import User model

// Function to participate in a quiz
export const participateInQuiz = async (req, res) => {
    const { quizId, answers } = req.body;
    const studentId = req.userId; // Assuming userId is set by verifyToken middleware

    try {
        // Check if the quiz exists
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Logic to evaluate answers and calculate score
        const score = evaluateQuiz(quiz, answers); // Assume evaluateQuiz is a function that calculates the score

        // Save the result (this could be a separate model)
        // For example, you might want to save the score to a QuizResult model

        res.status(200).json({ message: 'Quiz submitted successfully', score });
    } catch (error) {
        console.error('Error participating in quiz:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to evaluate quiz answers
const evaluateQuiz = (quiz, answers) => {
    // Logic to evaluate answers and return the score
    let score = 0;
    quiz.questions.forEach((question, index) => {
        if (question.correctAnswer === answers[index]) {
            score++;
        }
    });
    return score;
};
