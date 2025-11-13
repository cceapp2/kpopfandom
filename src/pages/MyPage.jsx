import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';

export default function MyPage() {
  const [userData, setUserData] = useState(null);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, fetchUser } = useAuth();
  const { playPlaylist } = usePlayer();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, playlistsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/playlists')
      ]);
      setUserData(userRes.data);
      // Filter user's playlists
      const userPlaylists = playlistsRes.data.playlists.filter(
        p => p.creatorId._id === userRes.data._id
      );
      setMyPlaylists(userPlaylists);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 프로필 섹션 */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {userData?.profileImage ? (
                <img src={userData.profileImage} alt={userData.displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{userData?.displayName}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-2 bg-gradient-primary text-white rounded-full font-semibold">
                  {userData?.curatorLevel} 팬
                </span>
                <span className="text-gray-600">{userData?.curatorPoints}점</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{myPlaylists.length}</div>
                  <div className="text-sm text-gray-600">플레이리스트</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userData?.likedTracks?.length || 0}</div>
                  <div className="text-sm text-gray-600">좋아요한 곡</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{userData?.followingArtists?.length || 0}</div>
                  <div className="text-sm text-gray-600">팔로잉</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 내 플레이리스트 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">내 플레이리스트</h2>
            <Link
              to="/create-playlist"
              className="px-4 py-2 bg-gradient-primary text-white rounded-full text-sm font-semibold hover:shadow-lg transition-all"
            >
              새로 만들기
            </Link>
          </div>
          {myPlaylists.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-gray-600 mb-4">아직 플레이리스트가 없습니다</p>
              <Link
                to="/create-playlist"
                className="inline-block px-6 py-2 bg-gradient-primary text-white rounded-full font-semibold hover:shadow-lg"
              >
                첫 플레이리스트 만들기
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPlaylists.map((playlist) => (
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
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{playlist.description}</p>
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
        </section>
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
