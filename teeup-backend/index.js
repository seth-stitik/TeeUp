require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const port = 5000;
const users = [];

const authenticateToken = (req, res, next) => {
    //Extract the token from the Authorization header
    console.log("Authenticating token...");
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    
    if (token == null) {
        console.log("No token found.");
        return res.sendStatus(401); // No token, unauthorized
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Error verifying token:", err.message);
            return res.sendStatus(403); // Token invalid or expired
        }
        console.log("Token verified, user ID:", user.userId);
        req.user = user;
        next();
    });
};

app.use(cors());
app.use(express.json()); // Parse JSON bodies

app.get('/', (req, res) => {
    res.send('Welcome to TeeUp!');
});

// Connection with test database
app.get('/test-db', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT NOW()');
        res.json(rows);
    } catch (err) {
        console.error("Database connection error:", err.message);
        res.status(500).send('Error connecting to database');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

////////// Signup Route ////////////////

////////////////////////////////////////
////////// Test this route ////////////
///////////////////////////////////////
// app.post('/signup', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = { username, password: hashedPassword };
//         users.push(user);
//         res.status(201).send("User created");
//     } catch (error) {
//         res.status(500).send("Error creating user");
//     }
// });
app.post('/signup', async (req, res) => {
    // Destructure the request body
    const { username, email, password, bio, handicap } = req.body;
   
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Prepare SQL query
        const insertUserQuery = 'INSERT INTO users (username, email, password, bio, handicap) VALUES ($1, $2, $3, $4, $5)';
        
        // Execute the query
        await pool.query(insertUserQuery, [username, email, hashedPassword, bio, handicap]);
        
        // If insertion is successful, send success response
        res.status(201).send("User created successfully");
    } catch (error) {
        console.error(error);

        //Send a different status code for duplicate username/email
        if (error.code === '23505') {
            res.status(409).send("Username or email already exists.");
        } else {
            // For other erros, send a generic error response
            res.status(500).send("Error creating user");
        }
    }
});


////////// Login Route ////////////////

////////////////////////////////////////
////////// Test this route ////////////
///////////////////////////////////////
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     const user = users.find(user => user.username === username);
//     if (user && await bcrypt.compare(password, user.password)) {
//         const token = jwt.sign({ username: user.username }, "secret", { expiresIn: '24h' });
//         res.json({ token });
//     } else {
//         res.status(400).send("Invalid credentials");
//     }
// });

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query database for a user with provided email
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length > 0) {
            const user = rows[0];

            // Check if user exists and password is correct
            if (await bcrypt.compare(password, user.password)) {
                // Generate JWT token
                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
                
                // Send token as response
                res.json({ token });
            } else {
                // User not found or password does not match
                res.status(400).send("Invalid credentials");
            }
        } else {
            res.status(400).send("User not found");
        }
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).send("Server error");
    }
});

////////// Profile Route ////////////////

app.get('/profile/:userId', authenticateToken, async (req, res) => {
    console.log(`Fetching profile for user ID: ${req.params.userId}`);

    // Check if the user ID in the token matches the requested user ID
    if (parseInt(req.user.userId, 10) !== parseInt(req.params.userId, 10)) {
        console.log("User ID mismatch.");
        return res.status(403).send("Access Denied");
    }

    try {
        // Query the database for the user's profile using userId
        const { rows } = await pool.query('SELECT username, email, bio, handicap FROM users WHERE id = $1', [req.params.userId]);
        if (rows.length > 0) {
            // Send the profile data as response
            res.json(rows[0]);
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).send("Server error");
    }
});

////////// Profile Management ////////////////

app.put('/profile/:userId', authenticateToken, async (req, res) => {
    console.log(`Updating profile for user ID: ${req.params.userId}`);
    if (parseInt(req.user.userId, 10) !== parseInt(req.params.userId, 10)) {
        console.log("User ID mismatch on update.");
        return res.status(403).send("Access Denied");
    }

    const { email, bio, handicap } = req.body;
    try {
        const updateQuery = 'UPDATE users SET email = $1, bio = $2, handicap = $3 WHERE id = $4';
        await pool.query(updateQuery, [email, bio, handicap, req.params.userId]);
        res.send("Profile updated successfully");
    } catch (error) {
        console.error("Error updating profile:", error.message);
        res.status(500).send("Server error");
    }
});
