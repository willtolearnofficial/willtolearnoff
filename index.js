const { MongoClient } = require('mongodb');

export default async ({ req, res, log, error }) => {
    // 1. Get the MongoDB URI from Environment Variables (set in Appwrite Dashboard)
    const MONGO_URI = process.env.MONGO_URI; 
    const client = new MongoClient(MONGO_URI);

    try {
        const { username, password, mode } = JSON.parse(req.body);
        await client.connect();
        
        const db = client.db("WillToLearnDB");
        const users = db.collection("users");

        if (mode === 'signup') {
            // Check if user exists
            const existingUser = await users.findOne({ username });
            if (existingUser) {
                return res.json({ success: false, message: "Username already exists!" });
            }
            // Create User
            await users.insertOne({ username, password, createdAt: new Date() });
            return res.json({ success: true, message: "User created in MongoDB!" });
        } 

        if (mode === 'login') {
            // Verify User
            const user = await users.findOne({ username, password });
            if (user) {
                return res.json({ success: true, message: "Login successful!" });
            } else {
                return res.json({ success: false, message: "Invalid credentials." });
            }
        }

    } catch (err) {
        error(err.message);
        return res.json({ success: false, message: "Database Error: " + err.message });
    } finally {
        await client.close();
    }
};
