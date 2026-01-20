const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register & Send OTP (UPDATED FOR BUG #3)
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (user && !user.isVerified) {
      // OVERWRITE existing unverified user
      user.name = name;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
    } else {
      // Create NEW user
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000
      });
    }

    // Send Email
    await transporter.sendMail({
      from: `"LegacyHR Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Account - LegacyHR',
      text: `Your verification code is: ${otp}. Valid for 10 minutes.`,
    });

    res.status(201).json({ message: 'OTP sent to email', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... (Keep verifyEmail, loginUser, forgotPassword, resetPassword exactly as they were) ...
// For brevity, I am not pasting the unchanged functions, but ensure you keep them!

const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.otp === otp && user.otpExpires > Date.now()) {
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email first' });
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: `"LegacyHR Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Code - LegacyHR',
      text: `Your password reset code is: ${otp}`,
    });

    res.json({ message: 'OTP sent', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { userId, otp, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, verifyEmail, loginUser, forgotPassword, resetPassword };