import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorType: {
    type: String,
    enum: ['fan', 'artist'],
    default: 'fan'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  trackIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  genreTags: [{
    type: String
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  playCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  },
  exposureScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate exposure score before saving
playlistSchema.pre('save', function(next) {
  // Simple scoring: likes * 2 + plays * 1 + shares * 3
  this.exposureScore = (this.likeCount * 2) + (this.playCount * 1) + (this.shareCount * 3);
  next();
});

export default mongoose.model('Playlist', playlistSchema);
