import express from 'express';
import {
  submitContact,
  getAllInquiries,
  updateInquiryStatus,
  getAnalytics,
  deleteInquiry
} from '../controllers/contactController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Route
router.post('/', submitContact);

// Admin Protected Routes
router.use(protect);
router.get('/all', getAllInquiries);
router.patch('/:id', restrictTo('super_admin', 'admin'), updateInquiryStatus);
router.delete('/:id', restrictTo('super_admin'), deleteInquiry);
router.get('/analytics', restrictTo('super_admin', 'admin'), getAnalytics);

export default router;