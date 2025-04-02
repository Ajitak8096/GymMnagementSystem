const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
require('./DBConn/conn');  // Ensure DB connection

app.use(cors({
    origin: 'http://localhost:3000', // Your React app's URL
    credentials: true
}))
app.use(cookieParser());
app.use(express.json());  // Middleware to parse JSON

const GymRoutes = require('./Routes/gym');
const MembershipRoutes = require('./Routes/membership');
const MemberRoutes = require('./Routes/member');

app.use('/auth', GymRoutes);
app.use('/plans',MembershipRoutes);
app.use('/members',MemberRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
