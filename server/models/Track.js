import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  genre: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true // in seconds
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  playCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  lyrics: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Track', trackSchema);
