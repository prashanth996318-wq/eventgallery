import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
  {
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
      required: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide the photo image URL'],
    },
    taggedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Photo = mongoose.model('Photo', photoSchema);
export default Photo;
