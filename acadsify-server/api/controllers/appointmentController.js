import Appointment from '../models/Appointment.js'; // Import the Appointment model

// Fetch all appointments
export const fetchAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.userId }); // Assuming appointments are linked to userId
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Book an appointment
export const bookAppointment = async (req, res) => {
    const { date, time } = req.body;
    try {
        const newAppointment = new Appointment({ userId: req.userId, date, time });
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Cancel an appointment
export const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const appointment = await Appointment.findByIdAndDelete(id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment canceled successfully' });
    } catch (error) {
        console.error('Error canceling appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
