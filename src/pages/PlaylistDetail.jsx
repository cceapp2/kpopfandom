import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

export default function PlaylistDetail() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playPlaylist, playTrack } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      const response = await api.get(`/playlists/${id}`);
      setPlaylist(response.data);
    } catch (error) {
      console.error('Failed to fetch playlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await api.post(`/playlists/${id}/like`);
      fetchPlaylist();
    } catch (error) {
      console.error('Failed to like playlist:', error);
    }
  };

  const handlePlayAll = () => {
    if (playlist) {
      playPlaylist(playlist);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">플레이리스트를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 플레이리스트 헤더 */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            {playlist.coverImage ? (
              <img
                src={playlist.coverImage}
                alt={playlist.title}
                className="w-48 h-48 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-48 h-48 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{playlist.title}</h1>
              <p className="text-gray-600 mb-4">{playlist.description || '설명이 없습니다'}</p>
              <div className="flex items-center gap-4 mb-4">
                <Link
                  to={`/artist/${playlist.creatorId?._id}`}
                  className="text-primary-600 hover:underline"
                >
                  {playlist.creatorId?.displayName}
                </Link>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{playlist.trackIds?.length || 0}곡</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{playlist.playCount} 재생</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayAll}
                  className="px-6 py-2 bg-gradient-primary text-white rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  재생
                </button>
                <button
                  onClick={handleLike}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    playlist.isLiked
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {playlist.likeCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 트랙 리스트 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">곡 목록</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {playlist.trackIds?.map((track, index) => (
              <div
                key={track._id}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => playTrack(track)}
              >
                <span className="text-gray-400 w-8">{index + 1}</span>
                {track.coverImage && (
                  <img src={track.coverImage} alt={track.title} className="w-12 h-12 rounded object-cover" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{track.title}</p>
                  <p className="text-sm text-gray-600">{track.artistId?.name}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/home" className="text-2xl font-bold text-gradient">
            FAN:STAGE
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/discover" className="text-gray-700 hover:text-primary-600">
              발견
            </Link>
            <Link to="/mypage" className="text-gray-700 hover:text-primary-600">
              마이페이지
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{user?.displayName}</span>
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                {user?.curatorLevel}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
