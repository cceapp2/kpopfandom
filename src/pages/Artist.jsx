import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

export default function Artist() {
  const { id } = useParams();
  const [artistData, setArtistData] = useState(null);
  const [activeTab, setActiveTab] = useState('music');
  const [loading, setLoading] = useState(true);
  const { playTrack, playPlaylist } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    fetchArtist();
  }, [id]);

  const fetchArtist = async () => {
    try {
      const response = await api.get(`/artists/${id}`);
      setArtistData(response.data);
    } catch (error) {
      console.error('Failed to fetch artist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await api.post(`/users/${user._id}/follow/${id}`);
      fetchArtist();
    } catch (error) {
      console.error('Failed to follow artist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!artistData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">아티스트를 찾을 수 없습니다</p>
      </div>
    );
  }

  const { artist, tracks, posts, playlists, isFollowing } = artistData;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 아티스트 헤더 */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {artist.profileImage ? (
                <img src={artist.profileImage} alt={artist.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{artist.name}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {artist.genres?.map((genre, index) => (
                  <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 mb-4">{artist.bio || '소개가 없습니다'}</p>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{artist.followerCount} 팬</span>
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-gradient-primary text-white hover:shadow-lg'
                  }`}
                >
                  {isFollowing ? '팔로잉' : '팔로우'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('music')}
            className={`pb-2 px-4 font-semibold ${
              activeTab === 'music'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            음악 ({tracks?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`pb-2 px-4 font-semibold ${
              activeTab === 'feed'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            피드 ({posts?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('fan')}
            className={`pb-2 px-4 font-semibold ${
              activeTab === 'fan'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'text-gray-600'
            }`}
          >
            팬 큐레이션 ({playlists?.length || 0})
          </button>
        </div>

        {/* 콘텐츠 */}
        {activeTab === 'music' && (
          <div className="space-y-2">
            {tracks?.map((track) => (
              <div
                key={track._id}
                className="bg-white rounded-lg p-4 flex items-center gap-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => playTrack(track)}
              >
                {track.coverImage && (
                  <img src={track.coverImage} alt={track.title} className="w-16 h-16 rounded object-cover" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{track.title}</p>
                  <p className="text-sm text-gray-600">{track.genre}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {track.likeCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="space-y-4">
            {posts?.map((post) => (
              <div key={post._id} className="bg-white rounded-lg p-6 shadow">
                <p className="text-gray-800 mb-4">{post.content}</p>
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {post.images.map((img, index) => (
                      <img key={index} src={img} alt={`Post ${index + 1}`} className="w-full rounded" />
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {post.likeCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'fan' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists?.map((playlist) => (
              <div
                key={playlist._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
                onClick={() => playPlaylist(playlist)}
              >
                {playlist.coverImage ? (
                  <img src={playlist.coverImage} alt={playlist.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gradient-primary flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{playlist.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {playlist.creatorId?.displayName}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{playlist.trackIds?.length || 0}곡</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {playlist.likeCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
