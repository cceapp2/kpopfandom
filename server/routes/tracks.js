import express from 'express';
import Track from '../models/Track.js';
import Interaction from '../models/Interaction.js';
import User from '../models/User.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all tracks
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { artistId, genre, search, limit = 20, page = 1, sort = 'releaseDate' } = req.query;
    const query = {};

    if (artistId) {
      query.artistId = artistId;
    }

    if (genre) {
      query.genre = genre;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const sortOptions = {
      releaseDate: { releaseDate: -1 },
      playCount: { playCount: -1 },
      likeCount: { likeCount: -1 }
    };

    const tracks = await Track.find(query)
      .populate('artistId', 'name profileImage')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions[sort] || sortOptions.releaseDate);

    const total = await Track.countDocuments(query);

    res.json({
      tracks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single track
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const track = await Track.findById(req.params.id)
      .populate('artistId', 'name profileImage bio genres');

    if (!track) {
      return res.status(404).json({ message: '곡을 찾을 수 없습니다' });
    }

    // Increment play count
    track.playCount += 1;
    await track.save();

    // Record interaction if user is logged in
    if (req.user) {
      await Interaction.findOneAndUpdate(
        { userId: req.user._id, type: 'play_track', targetId: track._id },
        { userId: req.user._id, type: 'play_track', targetId: track._id, targetModel: 'Track' },
        { upsert: true, new: true }
      );
    }

    // Check if user liked the track
    let isLiked = false;
    if (req.user) {
      const interaction = await Interaction.findOne({
        userId: req.user._id,
        type: 'like_track',
        targetId: track._id
      });
      isLiked = !!interaction;
    }

    res.json({ ...track.toObject(), isLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create track
router.post('/', authenticate, async (req, res) => {
  try {
    // Verify user is an artist
    const Artist = (await import('../models/Artist.js')).default;
    const artist = await Artist.findOne({ userId: req.user._id });
    
    if (!artist) {
      return res.status(403).json({ message: '아티스트만 곡을 업로드할 수 있습니다' });
    }

    const track = new Track({
      artistId: artist._id,
      ...req.body
    });

    await track.save();
    res.status(201).json(track);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike track
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ message: '곡을 찾을 수 없습니다' });
    }

    const existingInteraction = await Interaction.findOne({
      userId: req.user._id,
      type: 'like_track',
      targetId: track._id
    });

    if (existingInteraction) {
      // Unlike
      await Interaction.findByIdAndDelete(existingInteraction._id);
      track.likeCount = Math.max(0, track.likeCount - 1);
      await track.save();

      // Remove from user's liked tracks
      const user = await User.findById(req.user._id);
      user.likedTracks = user.likedTracks.filter(id => id.toString() !== track._id.toString());
      await user.save();

      res.json({ liked: false, likeCount: track.likeCount });
    } else {
      // Like
      await Interaction.create({
        userId: req.user._id,
        type: 'like_track',
        targetId: track._id,
        targetModel: 'Track'
      });
      track.likeCount += 1;
      await track.save();

      // Add to user's liked tracks
      const user = await User.findById(req.user._id);
      if (!user.likedTracks.includes(track._id)) {
        user.likedTracks.push(track._id);
        await user.save();
      }

      res.json({ liked: true, likeCount: track.likeCount });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
