import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Private routes for all logged in users (e.g. parents viewing their student, teachers list)
router.get('/', protect, getStudents);
router.get('/:id', protect, getStudentById);

// Admin and Teacher modifications
router.post('/', protect, authorizeRoles('admin', 'teacher'), createStudent);
router.put('/:id', protect, authorizeRoles('admin', 'teacher'), updateStudent);

// Admin only deletions
router.delete('/:id', protect, authorizeRoles('admin'), deleteStudent);

export default router;
