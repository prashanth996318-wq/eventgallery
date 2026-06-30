import Photo from '../models/Photo.js';
import Album from '../models/Album.js';
import Student from '../models/Student.js';
import { uploadToCloudinary, isCloudinaryConfigured } from '../config/cloudinary.js';
import fs from 'fs';

// Helper to parse student IDs
const parseStudentIds = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    // If it's a JSON stringified array e.g., '["id1","id2"]'
    const parsed = JSON.parse(tags);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // Fall back to comma-separated string
  }
  return tags.split(',').map((id) => id.trim()).filter((id) => id.length > 0);
};

// @desc    Upload multiple/single photos
// @route   POST /api/photos/upload
// @access  Private (Teacher & Admin)
export const uploadPhotos = async (req, res) => {
  const { albumId, taggedStudents } = req.body;

  try {
    if (!albumId) {
      return res.status(400).json({ success: false, message: 'Album ID is required' });
    }

    // Verify album exists
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    // Check if files are attached
    let files = [];
    if (req.files) {
      files = req.files;
    } else if (req.file) {
      files = [req.file];
    }

    if (files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least one image' });
    }

    const studentIds = parseStudentIds(taggedStudents);

    const uploadedPhotos = [];

    for (const file of files) {
      let imageUrl = '';

      if (isCloudinaryConfigured) {
        try {
          const cloudinaryResult = await uploadToCloudinary(file.path, 'firstcry_event_gallery');
          imageUrl = cloudinaryResult.secure_url;
          // Delete local file after upload to Cloudinary
          fs.unlink(file.path, (err) => {
            if (err) console.error('Error deleting local temp file:', err);
          });
        } catch (cloudinaryError) {
          console.error('Cloudinary upload failure, keeping local path as fallback:', cloudinaryError);
          imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        }
      } else {
        // Fallback: full local static path
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      }

      const photo = await Photo.create({
        albumId,
        imageUrl,
        taggedStudents: studentIds,
        uploadedBy: req.user._id,
      });

      uploadedPhotos.push(photo);
    }

    res.status(201).json({
      success: true,
      message: `${uploadedPhotos.length} photo(s) uploaded successfully`,
      photos: uploadedPhotos,
    });
  } catch (error) {
    console.error('Photo upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all photos (with dynamic filtering)
// @route   GET /api/photos
// @access  Private
export const getPhotos = async (req, res) => {
  try {
    let query = {};

    // Filter by albumId if provided
    if (req.query.albumId) {
      query.albumId = req.query.albumId;
    }

    // Role-based restrictions
    if (req.user.role === 'parent') {
      // 1. Find all students belonging to this parent
      const parentStudents = await Student.find({ parentId: req.user._id });
      const studentIds = parentStudents.map((s) => s._id);

      // 2. Parents can only view photos tagged with their children
      query.taggedStudents = { $in: studentIds };

      // 3. Make sure the photo belongs to an APPROVED album
      const approvedAlbums = await Album.find({ approvalStatus: 'approved' });
      const approvedAlbumIds = approvedAlbums.map((a) => a._id);
      query.albumId = { $in: approvedAlbumIds };
      
      // If parent has targeted an album specifically, we make sure it's in their approved list
      if (req.query.albumId) {
        if (!approvedAlbumIds.map(id => id.toString()).includes(req.query.albumId)) {
          return res.status(403).json({ success: false, message: 'Album is not approved or not found' });
        }
        query.albumId = req.query.albumId;
      }
    }

    const photos = await Photo.find(query)
      .populate('taggedStudents', 'name class section admissionNumber')
      .populate('albumId', 'eventName eventDate category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: photos.length, photos });
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single photo details
// @route   GET /api/photos/:id
// @access  Private
export const getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('taggedStudents', 'name class section admissionNumber')
      .populate('albumId', 'eventName eventDate category approvalStatus');

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    // Authorization checks for parent
    if (req.user.role === 'parent') {
      // Must be an approved album
      if (photo.albumId.approvalStatus !== 'approved') {
        return res.status(403).json({ success: false, message: 'Not authorized to view photos in this album' });
      }

      // Check if their child is tagged
      const parentStudents = await Student.find({ parentId: req.user._id });
      const studentIds = parentStudents.map((s) => s._id.toString());
      
      const isTagged = photo.taggedStudents.some((s) => studentIds.includes(s._id.toString()));
      if (!isTagged) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this photo' });
      }
    }

    res.json({ success: true, photo });
  } catch (error) {
    console.error('Get photo details error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a photo
// @route   DELETE /api/photos/:id
// @access  Private (Teacher & Admin)
export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    // Ownership check for teachers
    if (req.user.role === 'teacher' && photo.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this photo' });
    }

    // Delete photo
    await Photo.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
