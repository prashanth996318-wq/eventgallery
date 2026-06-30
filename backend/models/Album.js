import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, 'Please add an event name'],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Please specify the event date'],
    },
    category: {
      type: String,
      required: [true, 'Please specify the category'],
      enum: [
        'Annual Day',
        'Sports Day',
        'Festival Celebrations',
        'Art Day',
        'Classroom Activities',
        'Cultural Programs',
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Album = mongoose.model('Album', albumSchema);
export default Album;
