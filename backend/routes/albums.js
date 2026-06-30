import express from 'express';
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  approveAlbum,
  rejectAlbum,
  getStats,
} from '../controllers/albumController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// General private access to get all albums
router.get('/', protect, getAlbums);

// Admin-only stats (must register BEFORE /:id)
router.get('/stats', protect, authorizeRoles('admin'), getStats);

// Get specific album details
router.get('/:id', protect, getAlbumById);

// Create, update, and delete albums
router.post('/', protect, authorizeRoles('admin', 'teacher'), createAlbum);
router.put('/:id', protect, authorizeRoles('admin', 'teacher'), updateAlbum);
router.delete('/:id', protect, authorizeRoles('admin', 'teacher'), deleteAlbum);

// Admin-only album status approval and rejection
router.put('/:id/approve', protect, authorizeRoles('admin'), approveAlbum);
router.put('/:id/reject', protect, authorizeRoles('admin'), rejectAlbum);

export default router;
