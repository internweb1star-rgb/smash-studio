import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from '../models/User.js';

dotenv.config({ path: './server/.env' });

const bootstrap = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Bootstrapping...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@smashstudio.tech';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Super Admin already exists. Skipping...');
      process.exit(0);
    }

    // Generate a secure random password instead of hardcoding one
    const tempPassword = crypto.randomBytes(12).toString('base64url');

    await User.create({
      name: 'System Root',
      email: adminEmail,
      password: tempPassword,
      role: 'super_admin',
      isApproved: true
    });

    console.log('==========================================');
    console.log('SUPER ADMIN CREATED SUCCESSFULLY');
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${tempPassword}`);
    console.log('SAVE THIS PASSWORD — it will not be shown again.');
    console.log('==========================================');

    process.exit(0);
  } catch (error) {
    console.error('Error bootstrapping admin:', error);
    process.exit(1);
  }
};

bootstrap();
