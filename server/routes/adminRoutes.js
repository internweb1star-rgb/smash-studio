import express from 'express';
import { 
  login, 
  logout, 
  inviteUser, 
  setupPassword, 
  getMe 
} from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/login', login);
router.post('/setup-password', setupPassword);

// Protected Routes (Logged in users)
router.use(protect);

router.get('/me', getMe);
router.post('/logout', logout);

// Restricted Routes (Super Admin Only)
router.post('/invite', restrictTo('super_admin'), inviteUser);

export default router;
