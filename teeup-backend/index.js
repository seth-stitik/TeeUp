require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const pool = require('./db');

const signupRoutes = require('./routes/signupRoutes');
const loginRoutes = require('./routes/loginRoutes');
const profileRoutes = require('./routes/profileRoutes');
const postRoutes = require('./routes/postRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const port = 5000;

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/profile', profileRoutes);
app.use('/api', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

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