import express from 'express';
import Artist from '../models/Artist.js';
import Track from '../models/Track.js';
import Interaction from '../models/Interaction.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get recommended artists
router.get('/artists', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('followingArtists');
    
    if (!user.followingArtists || user.followingArtists.length === 0) {
      // If user has no following artists, return popular artists
      const popularArtists = await Artist.find()
        .sort({ followerCount: -1 })
        .limit(10)
        .populate('userId', 'displayName email');
      
      return res.json({
        recommendations: popularArtists.map(artist => ({
          artist,
          reason: '인기 아티스트',
          matchScore: 0.5
        }))
      });
    }

    // Get artists liked by users who like the same artists
    const userLikedArtists = user.followingArtists.map(a => a._id);
    
    // Find users who like at least one of the same artists
    const similarUsers = await User.find({
      _id: { $ne: user._id },
      followingArtists: { $in: userLikedArtists }
    }).select('followingArtists');

    // Count how many times each artist appears
    const artistCounts = {};
    similarUsers.forEach(similarUser => {
      similarUser.followingArtists.forEach(artistId => {
        if (!userLikedArtists.includes(artistId)) {
          artistCounts[artistId] = (artistCounts[artistId] || 0) + 1;
        }
      });
    });

    // Get top recommended artists
    const recommendedArtistIds = Object.entries(artistCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([artistId]) => artistId);

    const recommendedArtists = await Artist.find({
      _id: { $in: recommendedArtistIds }
    })
      .populate('userId', 'displayName email');

    // Also get genre-based recommendations
    const userGenres = new Set();
    user.followingArtists.forEach(artist => {
      if (artist.genres) {
        artist.genres.forEach(genre => userGenres.add(genre));
      }
    });

    const genreArtists = await Artist.find({
      _id: { $nin: [...userLikedArtists, ...recommendedArtistIds] },
      genres: { $in: Array.from(userGenres) }
    })
      .limit(5)
      .populate('userId', 'displayName email');

    const recommendations = [
      ...recommendedArtistIds.map(artistId => {
        const artist = recommendedArtists.find(a => a._id.toString() === artistId);
        return {
          artist,
          reason: '비슷한 취향의 팬들이 좋아한 아티스트',
          matchScore: artistCounts[artistId] / similarUsers.length
        };
      }),
      ...genreArtists.map(artist => ({
        artist,
        reason: '선호 장르의 아티스트',
        matchScore: 0.6
      }))
    ].filter(r => r.artist).slice(0, 15);

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recommended tracks
router.get('/tracks', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('likedTracks')
      .populate('followingArtists');

    if (!user.likedTracks || user.likedTracks.length === 0) {
      // Return popular tracks
      const popularTracks = await Track.find()
        .populate('artistId', 'name profileImage')
        .sort({ playCount: -1 })
        .limit(20);
      
      return res.json({ tracks: popularTracks });
    }

    // Get tracks from followed artists
    const followedArtistIds = user.followingArtists.map(a => a._id);
    const newTracksFromFollowed = await Track.find({
      artistId: { $in: followedArtistIds },
      _id: { $nin: user.likedTracks.map(t => t._id) }
    })
      .populate('artistId', 'name profileImage')
      .sort({ releaseDate: -1 })
      .limit(10);

    // Get tracks similar to liked tracks (same genre)
    const likedGenres = new Set();
    user.likedTracks.forEach(track => {
      if (track.genre) {
        likedGenres.add(track.genre);
      }
    });

    const similarTracks = await Track.find({
      genre: { $in: Array.from(likedGenres) },
      _id: { $nin: user.likedTracks.map(t => t._id) }
    })
      .populate('artistId', 'name profileImage')
      .sort({ playCount: -1 })
      .limit(10);

    res.json({
      tracks: [...newTracksFromFollowed, ...similarTracks].slice(0, 20)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
