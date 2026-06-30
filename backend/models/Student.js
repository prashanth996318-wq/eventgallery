import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a student name'],
      trim: true,
    },
    class: {
      type: String,
      required: [true, 'Please specify the class'],
      trim: true,
    },
    section: {
      type: String,
      required: [true, 'Please specify the section'],
      trim: true,
    },
    admissionNumber: {
      type: String,
      required: [true, 'Please specify the admission number'],
      unique: true,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    studentPhoto: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
