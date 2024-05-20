const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const dbConnect = require('./dbConnect.js');
const userRouter = require('./Routes/user.route.js');
const authRouter = require('./Routes/auth.route.js');
const listingRouter = require('./Routes/listing.route.js');
const cookieParser = require('cookie-parser');

// Use a different variable name for your custom base directory
const baseDir = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(baseDir, '/client/dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(baseDir, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    dbConnect();
    console.log(`Server is running successfully on port ${PORT}`);
});
