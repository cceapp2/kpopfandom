import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like_track', 'like_playlist', 'play_track', 'follow_artist', 'share_playlist'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'targetModel'
  },
  targetModel: {
    type: String,
    enum: ['Track', 'Playlist', 'Artist'],
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
interactionSchema.index({ userId: 1, type: 1 });
interactionSchema.index({ targetId: 1, type: 1 });

export default mongoose.model('Interaction', interactionSchema);
