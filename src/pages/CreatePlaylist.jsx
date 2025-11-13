import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function CreatePlaylist() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    trackIds: [],
    genreTags: [],
    isPublic: true
  });
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await api.get('/tracks?limit=100');
      setTracks(response.data.tracks);
    } catch (error) {
      console.error('Failed to fetch tracks:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await api.get(`/tracks?search=${searchQuery}`);
      setSearchResults(response.data.tracks);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleAddTrack = (track) => {
    if (!formData.trackIds.find(t => t._id === track._id)) {
      setFormData({
        ...formData,
        trackIds: [...formData.trackIds, track]
      });
    }
  };

  const handleRemoveTrack = (trackId) => {
    setFormData({
      ...formData,
      trackIds: formData.trackIds.filter(t => t._id !== trackId)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.trackIds.length === 0) {
      alert('최소 1곡 이상 추가해주세요');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/playlists', {
        ...formData,
        trackIds: formData.trackIds.map(t => t._id)
      });
      navigate(`/playlist/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create playlist:', error);
      alert('플레이리스트 생성에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">새 플레이리스트 만들기</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="플레이리스트 제목"
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="4"
              placeholder="플레이리스트 설명"
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              커버 이미지 URL
            </label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="https://..."
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold mb-4">곡 추가</h2>
            
            {/* 검색 */}
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="곡 검색..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </form>

            {/* 검색 결과 */}
            {searchResults.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">검색 결과</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {searchResults.map((track) => (
                    <div
                      key={track._id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{track.title}</p>
                        <p className="text-xs text-gray-600">{track.artistId?.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddTrack(track)}
                        className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                      >
                        추가
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 추가된 곡 */}
            <div>
              <h3 className="text-sm font-semibold mb-2">
                추가된 곡 ({formData.trackIds.length})
              </h3>
              <div className="space-y-2">
                {formData.trackIds.map((track, index) => (
                  <div
                    key={track._id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-gray-400 w-6">{index + 1}</span>
                      {track.coverImage && (
                        <img src={track.coverImage} alt={track.title} className="w-10 h-10 rounded object-cover" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{track.title}</p>
                        <p className="text-xs text-gray-600">{track.artistId?.name}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTrack(track._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading || formData.trackIds.length === 0}
              className="px-6 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
            >
              {loading ? '생성 중...' : '만들기'}
            </button>
          </div>
        </form>
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
          <a href="/home" className="text-2xl font-bold text-gradient">
            FAN:STAGE
          </a>
          <div className="flex items-center gap-4">
            <a href="/discover" className="text-gray-700 hover:text-primary-600">
              발견
            </a>
            <a href="/mypage" className="text-gray-700 hover:text-primary-600">
              마이페이지
            </a>
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
    </nav>
  );
}
