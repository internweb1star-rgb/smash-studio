import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax'
  };

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: { user }
  });
};

/**
 * Admin Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Logout
 */
export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

/**
 * Invite New User (Super Admin only)
 */
export const inviteUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(inviteToken).digest('hex');

    const newUser = await User.create({
      name,
      email,
      role,
      inviteToken: hashedToken,
      inviteTokenExpiry: Date.now() + 48 * 60 * 60 * 1000 // 48 hours
    });

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const inviteURL = `${process.env.FRONTEND_URL}/setup-password?token=${inviteToken}`;

    const mailOptions = {
      from: `"Smash Studio Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'You are invited to join Smash Studio Admin Panel',
      html: `
        <h1>Welcome to Smash Studio, ${name}!</h1>
        <p>You have been invited to join our administration team as an <b>${role}</b>.</p>
        <p>Please click the link below to set up your password and activate your account:</p>
        <a href="${inviteURL}" style="padding: 10px 20px; background: #35A8F2; color: white; text-decoration: none; border-radius: 5px;">Set Up Account</a>
        <p>This link will expire in 48 hours.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      status: 'success',
      message: 'Invitation sent successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Setup Password (via Token)
 */
export const setupPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      inviteToken: hashedToken,
      inviteTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    user.password = password;
    user.inviteToken = undefined;
    user.inviteTokenExpiry = undefined;
    user.isApproved = true; // Auto-approve if invited by super admin for now, or keep false if manual approval needed
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get Current User Profile
 */
export const getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
};
