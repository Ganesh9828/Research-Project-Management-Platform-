import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  availability: { type: Boolean, default: true },
  interests: [ { type: [String], default: [] }],

  assignedStudents: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teacher',
    default: [],
  }],
  
});


const User = mongoose.model('user', userSchema);



export default User;
