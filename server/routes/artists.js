import express from 'express';
import Artist from '../models/Artist.js';
import Track from '../models/Track.js';
import Playlist from '../models/Playlist.js';
import ArtistPost from '../models/ArtistPost.js';
import User from '../models/User.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all artists
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { genre, search, limit = 20, page = 1 } = req.query;
    const query = {};

    if (genre) {
      query.genres = genre;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const artists = await Artist.find(query)
      .populate('userId', 'displayName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ followerCount: -1 });

    const total = await Artist.countDocuments(query);

    res.json({
      artists,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single artist
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id)
      .populate('userId', 'displayName email');

    if (!artist) {
      return res.status(404).json({ message: '아티스트를 찾을 수 없습니다' });
    }

    // Get artist tracks
    const tracks = await Track.find({ artistId: artist._id })
      .sort({ releaseDate: -1 });

    // Get artist posts
    const posts = await ArtistPost.find({ artistId: artist._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get fan playlists featuring this artist
    const playlists = await Playlist.find({
      trackIds: { $in: tracks.map(t => t._id) },
      isPublic: true
    })
      .populate('creatorId', 'displayName profileImage curatorLevel')
      .sort({ exposureScore: -1 })
      .limit(10);

    // Check if current user is following
    let isFollowing = false;
    if (req.user) {
      const user = await User.findById(req.user._id);
      isFollowing = user.followingArtists.includes(artist._id);
    }

    res.json({
      artist,
      tracks,
      posts,
      playlists,
      isFollowing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create artist profile
router.post('/', authenticate, async (req, res) => {
  try {
    // Check if user already has an artist profile
    const existingArtist = await Artist.findOne({ userId: req.user._id });
    if (existingArtist) {
      return res.status(400).json({ message: '이미 아티스트 프로필이 있습니다' });
    }

    // Check if user account type is artist
    if (req.user.accountType !== 'artist') {
      return res.status(400).json({ message: '아티스트 계정이 아닙니다' });
    }

    const artist = new Artist({
      userId: req.user._id,
      ...req.body
    });

    await artist.save();
    res.status(201).json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update artist profile
router.put('/:id', authenticate, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ message: '아티스트를 찾을 수 없습니다' });
    }

    if (artist.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    Object.assign(artist, req.body);
    await artist.save();

    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create artist post
router.post('/:id/posts', authenticate, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ message: '아티스트를 찾을 수 없습니다' });
    }

    if (artist.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    const post = new ArtistPost({
      artistId: artist._id,
      ...req.body
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
