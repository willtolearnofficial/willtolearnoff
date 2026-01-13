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
// without "Blocked by CORS" errors.
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// --- MONGODB CONNECTION ---
// Priority 1: Use Render Environment Variable (process.env.MONGO_URI)
// Priority 2: Use the fallback string
const mongoURI = process.env.MONGO_URI || "mongodb+srv://will_123:will12345@cluster0.bynok57.mongodb.net/WillToLearnDB?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        // This log helps you see if the IP whitelist is the problem
    });

// --- USER SCHEMA ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// --- ROUTES ---

// 1. FORCE index1.html as the homepage
// We put this ABOVE app.use(express.static) to make sure index.html doesn't take over.
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

// 3. Serve other files (home.html, LOGO.jpeg, etc.)
app.use(express.static(__dirname));

// --- START SERVER ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server flying on port ${PORT}`);
});
