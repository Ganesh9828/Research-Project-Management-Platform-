import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./api/routes/userRoutes.js"; 
import appointmentRoutes from './api/routes/appointmentRoutes.js';
import assignmentRoutes from './api/routes/assignmentRoutes.js';
import meetingRoutes from './api/routes/meetingRoutes.js';
import notificationRoutes from './api/routes/notificationRoutes.js';
import adminRoutes from './api/routes/adminRoutes.js';
import authRoutes from './api/routes/authRoutes.js'; // Import auth routes
import eventRoutes from './api/routes/eventRoutes.js'; // Import event routes
import themeRoutes from './api/routes/themeRoutes.js'; // Import theme routes

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb configuration using mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@acadsify.lwoku.mongodb.net/?retryWrites=true&w=majority&appName=AcadSify`
  )
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((error) => console.log("Error connecting to MongoDB", error));

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/theme', themeRoutes); 
app.use('/api/appointments', appointmentRoutes); // Use appointment routes
app.use('/api/assignments', assignmentRoutes); // Use assignment routes
app.use('/api/meetings', meetingRoutes); // Use meeting routes
app.use('/api/notifications', notificationRoutes); // Use notification routes
app.use('/api/admin', adminRoutes); // Use admin routes
app.use('/api/events', eventRoutes); // Use event routes

app.get("/", (req, res) => {
  res.send("Hello AcadSify Client Server!");
});

app.get("/api", (req, res) => {
  res.send("Hello AcadSify API!");
});

app.get("/api/signup", (req, res) => {
  res.send("Hello AcadSify signup API!");
});

app.get("/api/:firebaseUID", (req, res) => {
  res.send("Hello AcadSify User API!");
console.log(req.params.firebaseUID);
});



app.listen(port, async () => {
  console.log(`AcadSify app listening on port ${port}`); // Updated to use backticks
});

// Export the app instance for testing
export default app;
