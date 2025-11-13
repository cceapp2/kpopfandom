import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followingArtists', 'name profileImage')
      .populate('likedTracks', 'title artistId coverImage')
      .populate('likedPlaylists', 'title coverImage');

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    const { displayName, profileImage, preferredGenres } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        displayName,
        profileImage,
        preferredGenres
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Follow/Unfollow artist
router.post('/:id/follow/:artistId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const artistId = req.params.artistId;

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }

    const isFollowing = user.followingArtists.includes(artistId);
    
    if (isFollowing) {
      user.followingArtists = user.followingArtists.filter(id => id.toString() !== artistId);
    } else {
      user.followingArtists.push(artistId);
    }

    await user.save();
    res.json({ following: !isFollowing, followingArtists: user.followingArtists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
