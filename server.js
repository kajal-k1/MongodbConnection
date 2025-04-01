const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userData', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  file: String
});

const User = mongoose.model('User', userSchema);

// Multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Serve HTML Form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle Form Submission
app.post('/submit', upload.single('file'), async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;
    const file = req.file ? req.file.filename : null;

    const newUser = new User({ firstName, lastName, email, phoneNumber, file });
    await newUser.save();

    res.send('Data submitted successfully');
  } catch (error) {
    res.status(500).send('Error submitting data');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
