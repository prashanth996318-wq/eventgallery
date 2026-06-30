import Album from '../models/Album.js';
import Photo from '../models/Photo.js';
import Student from '../models/Student.js';
import User from '../models/User.js';

// @desc    Get all albums
// @route   GET /api/albums
// @access  Private
export const getAlbums = async (req, res) => {
  try {
    let query = {};

    // Parents can only view approved albums
    if (req.user.role === 'parent') {
      query.approvalStatus = 'approved';
    } else if (req.user.role === 'teacher') {
      // Teachers can see all albums, but we can also filter or sorting them
      // In this setup, teachers can see everything
    }

    // Optional category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Optional approvalStatus filter (e.g. for admin dashboards)
    if (req.query.approvalStatus && req.user.role !== 'parent') {
      query.approvalStatus = req.query.approvalStatus;
    }

    const albums = await Album.find(query)
      .populate('createdBy', 'name email')
      .sort({ eventDate: -1 });

    res.json({ success: true, count: albums.length, albums });
  } catch (error) {
    console.error('Get albums error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single album details
// @route   GET /api/albums/:id
// @access  Private
export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('createdBy', 'name email');

    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    // Parents cannot view pending or rejected albums
    if (req.user.role === 'parent' && album.approvalStatus !== 'approved') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this album' });
    }

    res.json({ success: true, album });
  } catch (error) {
    console.error('Get album detail error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create an album
// @route   POST /api/albums
// @access  Private (Teacher & Admin)
export const createAlbum = async (req, res) => {
  const { eventName, eventDate, category, description } = req.body;

  try {
    const album = await Album.create({
      eventName,
      eventDate: eventDate || new Date(),
      category,
      description: description || '',
      createdBy: req.user._id,
      approvalStatus: req.user.role === 'admin' ? 'approved' : 'pending', // Admins auto-approve
    });

    res.status(201).json({ success: true, album });
  } catch (error) {
    console.error('Create album error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update album details
// @route   PUT /api/albums/:id
// @access  Private (Teacher & Admin)
export const updateAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    // Check ownership for teachers
    if (req.user.role === 'teacher' && album.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this album' });
    }

    const { eventName, eventDate, category, description } = req.body;

    album.eventName = eventName || album.eventName;
    album.eventDate = eventDate || album.eventDate;
    album.category = category || album.category;
    album.description = description || album.description;

    // Reset approval status if edited by teacher
    if (req.user.role === 'teacher') {
      album.approvalStatus = 'pending';
    }

    const updatedAlbum = await album.save();
    res.json({ success: true, album: updatedAlbum });
  } catch (error) {
    console.error('Update album error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve an album
// @route   PUT /api/albums/:id/approve
// @access  Private (Admin only)
export const approveAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    album.approvalStatus = 'approved';
    album.rejectionReason = '';

    await album.save();
    res.json({ success: true, message: 'Album approved successfully', album });
  } catch (error) {
    console.error('Approve album error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject an album
// @route   PUT /api/albums/:id/reject
// @access  Private (Admin only)
export const rejectAlbum = async (req, res) => {
  const { rejectionReason } = req.body;

  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    album.approvalStatus = 'rejected';
    album.rejectionReason = rejectionReason || 'Rejected by Admin';

    await album.save();
    res.json({ success: true, message: 'Album rejected successfully', album });
  } catch (error) {
    console.error('Reject album error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an album and its photos
// @route   DELETE /api/albums/:id
// @access  Private (Admin & Creator Teacher)
export const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    // Check ownership for teachers
    if (req.user.role === 'teacher' && album.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this album' });
    }

    // Delete all photos associated with the album
    await Photo.deleteMany({ albumId: req.params.id });

    // Delete the album
    await Album.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Album and its photos deleted successfully' });
  } catch (error) {
    console.error('Delete album error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics / stats
// @route   GET /api/albums/stats
// @access  Private (Admin only)
export const getStats = async (req, res) => {
  try {
    const totalAlbums = await Album.countDocuments();
    const pendingAlbums = await Album.countDocuments({ approvalStatus: 'pending' });
    const approvedAlbums = await Album.countDocuments({ approvalStatus: 'approved' });
    const rejectedAlbums = await Album.countDocuments({ approvalStatus: 'rejected' });

    const totalStudents = await Student.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalParents = await User.countDocuments({ role: 'parent' });
    const totalPhotos = await Photo.countDocuments();

    res.json({
      success: true,
      stats: {
        totalAlbums,
        pendingAlbums,
        approvedAlbums,
        rejectedAlbums,
        totalStudents,
        totalUsers,
        totalTeachers,
        totalParents,
        totalPhotos,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
