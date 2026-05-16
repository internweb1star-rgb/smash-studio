import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
    },
    organization: {
      type: String,
      required: [true, 'Organization name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    domain: {
      type: String,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Closed', 'Spam'],
      default: 'New'
    },
    adminNotes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Contact', contactSchema);