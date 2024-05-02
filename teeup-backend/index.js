require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Ensure this is defined if you are using it for '/test-db'

// Updated route imports
const socialRoutes = require('./routes/socialRoutes'); // This is new
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5000; // Good to use an environment variable for the port

const corsOptions = {
    origin: 'http://localhost:5173', // Make sure this matches the client-side URL
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies

// Updated route usage
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/api', socialRoutes); // All social interaction routes are now under '/api'

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
