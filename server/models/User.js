import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'] 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: false, // Optional for invited users initially
    select: false // Don't include password by default in queries
  },
  role: { 
    type: String, 
    enum: ['super_admin', 'admin', 'editor'], 
    default: 'admin' 
  },
  isApproved: { 
    type: Boolean, 
    default: false 
  },
  inviteToken: String,
  inviteTokenExpiry: Date,
  twoFactorSecret: String,
  isTwoFactorEnabled: { 
    type: Boolean, 
    default: false 
  },
  lastLogin: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
