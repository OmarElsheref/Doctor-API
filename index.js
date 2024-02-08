const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB
const mongoDBConnectionString = 'mongodb+srv://omar:omar@cluster0.rsdgr1i.mongodb.net/flutter_app_db';
mongoose.connect(mongoDBConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a mongoose model for the Doctor
const Doctor = mongoose.model('Doctor', {
  name: String,
  email: String,
  password: String,
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Express route handler for registering a new doctor
app.post('/api/register-doctor', async (req, res) => {
  try {
    // Assuming req.body contains the doctor data
    const { name, email, password, confirmPassword } = req.body;

    // Validate data (You should add more validation logic)
    if (!name || !email || !password || password !== confirmPassword) {
      return res.status(400).json({ error: 'Invalid data provided' });
    }

    // Check if the email is already registered
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create a new doctor instance
    const newDoctor = new Doctor({ name, email, password });

    // Save the doctor to the 'doctors' collection in MongoDB
    await newDoctor.save();

    // Respond with a success status
    return res.status(201).json({ message: 'Doctor account created successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});