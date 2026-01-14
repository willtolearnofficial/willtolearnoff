const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());

// UPDATED CORS: This allows your frontend to talk to this Render backend 
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// --- MONGODB CONNECTION ---
const mongoURI = process.env.MONGO_URI || "mongodb+srv://will_123:will12345@cluster0.bynok57.mongodb.net/WillToLearnDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
    });

// --- USER SCHEMA ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// --- ROUTES ---

// 1. Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index1.html'));
});

// 2. Signup Logic
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already taken!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: "Success" });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: "Server error during registration." });
    }
});

// 3. Login Logic (UPDATED)
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found. Please sign up." });
        }

        // 2. Compare the provided password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            res.status(200).json({ message: "Login successful!", username: user.username });
        } else {
            res.status(401).json({ error: "Incorrect password." });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error during login." });
    }
});

// 4. Serve other static files
app.use(express.static(__dirname));

// --- START SERVER ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server flying on port ${PORT}`);
});