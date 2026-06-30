import express from 'express';
import {
  uploadPhotos,
  getPhotos,
  getPhotoById,
  deletePhoto,
} from '../controllers/photoController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Upload event photos (limit to 20 photos at a time)
router.post(
  '/upload',
  protect,
  authorizeRoles('admin', 'teacher'),
  upload.array('images', 20),
  uploadPhotos
);

// Get list of photos (supports albumId filtering, and parent child tag enforcement)
router.get('/', protect, getPhotos);

// Get details for a single photo
router.get('/:id', protect, getPhotoById);

// Delete photo (Admin & Teacher creator)
router.delete('/:id', protect, authorizeRoles('admin', 'teacher'), deletePhoto);

export default router;
