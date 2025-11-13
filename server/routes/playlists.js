import express from 'express';
import Playlist from '../models/Playlist.js';
import Interaction from '../models/Interaction.js';
import User from '../models/User.js';
import Track from '../models/Track.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all playlists (feed)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { limit = 20, page = 1, sort = 'exposureScore' } = req.query;
    
    const sortOptions = {
      exposureScore: { exposureScore: -1, createdAt: -1 },
      createdAt: { createdAt: -1 },
      likeCount: { likeCount: -1 },
      playCount: { playCount: -1 }
    };

    const playlists = await Playlist.find({ isPublic: true })
      .populate('creatorId', 'displayName profileImage curatorLevel curatorPoints')
      .populate('trackIds', 'title artistId coverImage duration')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions[sort] || sortOptions.exposureScore);

    const total = await Playlist.countDocuments({ isPublic: true });

    res.json({
      playlists,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single playlist
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('creatorId', 'displayName profileImage curatorLevel curatorPoints')
      .populate({
        path: 'trackIds',
        populate: {
          path: 'artistId',
          select: 'name profileImage'
        }
      });

    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }

    // Increment play count
    playlist.playCount += 1;
    await playlist.save();

    // Record interaction if user is logged in
    if (req.user) {
      await Interaction.findOneAndUpdate(
        { userId: req.user._id, type: 'play_track', targetId: playlist._id },
        { userId: req.user._id, type: 'play_track', targetId: playlist._id, targetModel: 'Playlist' },
        { upsert: true, new: true }
      );
    }

    // Check if user liked the playlist
    let isLiked = false;
    if (req.user) {
      const interaction = await Interaction.findOne({
        userId: req.user._id,
        type: 'like_playlist',
        targetId: playlist._id
      });
      isLiked = !!interaction;
    }

    res.json({ ...playlist.toObject(), isLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create playlist
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, coverImage, trackIds, genreTags, isPublic } = req.body;

    const playlist = new Playlist({
      creatorId: req.user._id,
      creatorType: req.user.accountType,
      title,
      description,
      coverImage,
      trackIds,
      genreTags,
      isPublic: isPublic !== undefined ? isPublic : true
    });

    await playlist.save();

    // Update curator points
    const user = await User.findById(req.user._id);
    user.curatorPoints += 10; // Points for creating playlist
    user.updateCuratorLevel();
    await user.save();

    const populatedPlaylist = await Playlist.findById(playlist._id)
      .populate('creatorId', 'displayName profileImage curatorLevel')
      .populate('trackIds', 'title artistId coverImage duration');

    res.status(201).json(populatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update playlist
router.put('/:id', authenticate, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }

    if (playlist.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    Object.assign(playlist, req.body);
    await playlist.save();

    const populatedPlaylist = await Playlist.findById(playlist._id)
      .populate('creatorId', 'displayName profileImage curatorLevel')
      .populate('trackIds', 'title artistId coverImage duration');

    res.json(populatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete playlist
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }

    if (playlist.creatorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: '플레이리스트가 삭제되었습니다' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like/Unlike playlist
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }

    const existingInteraction = await Interaction.findOne({
      userId: req.user._id,
      type: 'like_playlist',
      targetId: playlist._id
    });

    if (existingInteraction) {
      // Unlike
      await Interaction.findByIdAndDelete(existingInteraction._id);
      playlist.likeCount = Math.max(0, playlist.likeCount - 1);
      await playlist.save();

      // Remove from user's liked playlists
      const user = await User.findById(req.user._id);
      user.likedPlaylists = user.likedPlaylists.filter(id => id.toString() !== playlist._id.toString());
      await user.save();

      res.json({ liked: false, likeCount: playlist.likeCount });
    } else {
      // Like
      await Interaction.create({
        userId: req.user._id,
        type: 'like_playlist',
        targetId: playlist._id,
        targetModel: 'Playlist'
      });
      playlist.likeCount += 1;
      await playlist.save();

      // Add to user's liked playlists
      const user = await User.findById(req.user._id);
      if (!user.likedPlaylists.includes(playlist._id)) {
        user.likedPlaylists.push(playlist._id);
        await user.save();
      }

      // Update curator points for playlist creator
      const creator = await User.findById(playlist.creatorId);
      if (creator) {
        creator.curatorPoints += 5; // Points for receiving like
        creator.updateCuratorLevel();
        await creator.save();
      }

      res.json({ liked: true, likeCount: playlist.likeCount });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Share playlist
router.post('/:id/share', authenticate, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }

    playlist.shareCount += 1;
    await playlist.save();

    await Interaction.create({
      userId: req.user._id,
      type: 'share_playlist',
      targetId: playlist._id,
      targetModel: 'Playlist'
    });

    res.json({ shareCount: playlist.shareCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
