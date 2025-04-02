const Gym = require('../Models/gym');  // Fixed folder path
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { userName, password, gymName, profilePic, email } = req.body;

        const isExist = await Gym.findOne({ userName });

        if (isExist) {
            return res.status(400).json({
                error: "Username already exists. Try another."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newGym = new Gym({
            userName,
            password: hashedPassword,
            gymName,
            profilePic: profilePic || "", // Default empty string
            email
        });

        await newGym.save();

        return res.status(201).json({ 
            message: 'User registered successfully', 
            success: "yes", 
            data: newGym 
        });

    } catch (err) {
        return res.status(500).json({ error: "Server Error", details: err.message });
    }
};

const cookieOptions = {
    httpOnly: true,
    secure: false, // Set to true in production when you are deploying.
    sameSite: 'Lax'
};

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const gym = await Gym.findOne({ userName });

        if (gym && await bcrypt.compare(password, gym.password)) {

            const token = jwt.sign({gym_id:gym._id},process.env.JWT_SecretKey);

            res.cookie("cookie_token",token,cookieOptions)
            


            return res.json({ 
                message: 'Logged in successfully', 
                success: "true", 
                gym,token
            });
        } else {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

    } catch (err) {
        return res.status(500).json({ error: "Server Error", details: err.message });
    }
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const gym = await Gym.findOne({ email });

        if (!gym) {
            return res.status(400).json({ error: 'Gym not found' });
        }

        const token = (crypto.randomInt(100000, 999999)).toString(); // Generates 6-digit OTP
        gym.resetPasswordToken = token;
        gym.resetPasswordExpires = Date.now() + 3600000; // 1-hour expiry

        await gym.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${token}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ error: 'Email sending failed', errorMsg: error.message });
            } else {
                return res.status(200).json({ message: "OTP sent to your email" });
            }
        });

    } catch (err) {
        return res.status(500).json({ error: "Server Error", details: err.message });
    }
};

exports.checkOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const gym = await Gym.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!gym) {
            return res.status(400).json({ error: 'OTP is invalid or has expired' });
        }

        return res.status(200).json({ message: "OTP successfully verified" });

    } catch (err) {
        return res.status(500).json({ error: "Server Error", details: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const gym = await Gym.findOne({ email });

        if (!gym) {
            return res.status(400).json({ error: 'Some technical issue, please try again later' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        gym.password = hashedPassword;
        gym.resetPasswordToken = undefined;
        gym.resetPasswordExpires = undefined;

        await gym.save();
        res.status(200).json({ message: "Password reset successfully" });

    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

exports.logout = async(req,res)=>{
    res.clearCookie('cookie_token', cookieOptions).json({ message: 'Logged out successfully'});

}


