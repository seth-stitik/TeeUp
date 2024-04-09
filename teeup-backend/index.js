const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;
const users = [];

app.use(cors());
app.use(express.json()); // Parse JSON bodies

app.get('/', (req, res) => {
    res.send('Welcome to TeeUp!');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// Signup Route
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { username, password: hashedPassword };
        users.push(user); // In a real app, you'd save this to your database
        res.status(201).send("User created");
    } catch (error) {
        res.status(500).send("Error creating user");
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        // In a real app, you should use an environment variable for the secret
        const token = jwt.sign({ username: user.username }, "secret", { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(400).send("Invalid credentials");
    }
});
