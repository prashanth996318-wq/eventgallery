import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  deleteUser,
} from '../controllers/authController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes
router.get('/me', protect, getMe);

// Admin-only user management routes
router.get('/users', protect, authorizeRoles('admin'), getUsers);
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUser);

export default router;
