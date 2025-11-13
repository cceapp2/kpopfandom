import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  accountType: {
    type: String,
    enum: ['fan', 'artist'],
    default: 'fan'
  },
  preferredGenres: [{
    type: String
  }],
  curatorLevel: {
    type: String,
    enum: ['씨앗', '새싹', '꽃', '나무', '숲'],
    default: '씨앗'
  },
  curatorPoints: {
    type: Number,
    default: 0
  },
  followingArtists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }],
  likedTracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track'
  }],
  likedPlaylists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  password: {
    type: String,
    required: function() {
      return !this.googleId && !this.kakaoId;
    }
  },
  googleId: String,
  kakaoId: String
}, {
  timestamps: true
});

// Update curator level based on points
userSchema.methods.updateCuratorLevel = function() {
  if (this.curatorPoints >= 5000) {
    this.curatorLevel = '숲';
  } else if (this.curatorPoints >= 1000) {
    this.curatorLevel = '나무';
  } else if (this.curatorPoints >= 500) {
    this.curatorLevel = '꽃';
  } else if (this.curatorPoints >= 100) {
    this.curatorLevel = '새싹';
  } else {
    this.curatorLevel = '씨앗';
  }
};

export default mongoose.model('User', userSchema);
