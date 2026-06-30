import Student from '../models/Student.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin & Teacher)
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).populate('parentId', 'name email').sort({ name: 1 });
    res.json({ success: true, count: students.length, students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('parentId', 'name email');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, student });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a student
// @route   POST /api/students
// @access  Private (Admin & Teacher)
export const createStudent = async (req, res) => {
  const { name, class: className, section, admissionNumber, parentId, studentPhoto } = req.body;

  try {
    // Check if admission number exists
    const studentExists = await Student.findOne({ admissionNumber });
    if (studentExists) {
      return res.status(400).json({ success: false, message: 'Student with this Admission Number already exists' });
    }

    const student = await Student.create({
      name,
      class: className,
      section,
      admissionNumber,
      parentId: parentId || null,
      studentPhoto: studentPhoto || '',
    });

    res.status(201).json({ success: true, student });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private (Admin & Teacher)
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const { name, class: className, section, admissionNumber, parentId, studentPhoto } = req.body;

    // Check if admission number is being changed and is already taken
    if (admissionNumber && admissionNumber !== student.admissionNumber) {
      const numberTaken = await Student.findOne({ admissionNumber });
      if (numberTaken) {
        return res.status(400).json({ success: false, message: 'Admission Number is already in use' });
      }
    }

    student.name = name || student.name;
    student.class = className || student.class;
    student.section = section || student.section;
    student.admissionNumber = admissionNumber || student.admissionNumber;
    student.parentId = parentId !== undefined ? parentId : student.parentId;
    student.studentPhoto = studentPhoto !== undefined ? studentPhoto : student.studentPhoto;

    const updatedStudent = await student.save();
    const populated = await Student.findById(updatedStudent._id).populate('parentId', 'name email');

    res.json({ success: true, student: populated });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin only)
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
