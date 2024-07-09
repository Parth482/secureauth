// index.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
const authRoutes = require('./routes/auth');
const app = express();
const PORT = process.env.PORT || 3000;
const dashboardRoutes = require('./routes/dashboardRoutes');
const profileRouter = require('./routes/profile');

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome to the SecureAuth API');
});


app.use('/dashboard', dashboardRoutes);

app.use('/auth', authRoutes);

app.use('/profile', profileRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
