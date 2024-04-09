// require('dotenv').config();
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
    // Extract the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Format: "Bearer TOKEN"

    if (token == null) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token invalid or expired
        req.user = user; // Add user payload to request object
        next(); // Proceed to the next middleware/route handler
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
        const { rows} = await pool.query('SELECT NOW()');
        res.json(rows);
    } catch (err) {
        console.log(err);
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

        // If insertion is successful, send a success response
        res.status(201).send("User created successfully");
    } catch (error) {
        console.error(error);

        // Send a different status code for duplicate username/email
        if (error.code === '23505') { // 23505 is the code for a unique violation
            return res.status(409).send("Username or email already exists.");
        }

        // For other errors, send a generic error response
        res.status(500).send("Error creating user");
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

app.post ('/login', async (req, res) => {
    const { email, password } = req.body ;

    try {
        // Query database for a user with provided email
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = rows[0];

        // Check if user existsa and password is correct
        if (user && await bcrypt.compare(password, user.password)) {
            // Generate a JWT token
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

            // Send the token to client
            res.json({ token });
        } else {
            //User not found or password does not match
            res.status(400).send("Invalid credentials");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});


app.get('/profile', authenticateToken, async (req, res) => {
    // The user's ID is stored in req.user.userId, based on how we set up the JWT payload
    const userId = req.user.userId;

    try {
        // Query the database for the user's profile using userId
        const { rows } = await pool.query('SELECT username, email, bio, handicap FROM users WHERE id = $1', [userId]);
        const userProfile = rows[0];

        if (!userProfile) {
            return res.status(404).send("User not found");
        }

        // Send back the user profile information
        res.json(userProfile);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
