import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';

export default function Discover() {
  const [recommendations, setRecommendations] = useState([]);
  const [artists, setArtists] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const [recRes, artistsRes] = await Promise.all([
        api.get('/recommendations/artists'),
        api.get('/artists?limit=20')
      ]);
      setRecommendations(recRes.data.recommendations || []);
      setArtists(artistsRes.data.artists);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const [artistsRes, tracksRes] = await Promise.all([
        api.get(`/artists?search=${searchQuery}`),
        api.get(`/tracks?search=${searchQuery}`)
      ]);
      setSearchResults({
        artists: artistsRes.data.artists,
        tracks: tracksRes.data.tracks
      });
    } catch (error) {
      console.error('Search failed:', error);
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
        {/* 검색바 */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="아티스트, 곡 검색..."
              className="w-full px-4 py-3 pl-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>

        {searchResults ? (
          /* 검색 결과 */
          <div>
            {searchResults.artists.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">아티스트</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {searchResults.artists.map((artist) => (
                    <Link
                      key={artist._id}
                      to={`/artist/${artist._id}`}
                      className="text-center"
                    >
                      <div className="w-full aspect-square rounded-full overflow-hidden bg-gray-200 mb-2">
                        {artist.profileImage ? (
                          <img src={artist.profileImage} alt={artist.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-sm truncate">{artist.name}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {searchResults.tracks.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">곡</h2>
                <div className="space-y-2">
                  {searchResults.tracks.map((track) => (
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
                        <p className="text-sm text-gray-600">{track.artistId?.name}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-full">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <>
            {/* 추천 아티스트 */}
            {recommendations.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">내가 좋아할 아티스트</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recommendations.map((rec, index) => (
                    <Link
                      key={rec.artist._id}
                      to={`/artist/${rec.artist._id}`}
                      className="text-center"
                    >
                      <div className="w-full aspect-square rounded-full overflow-hidden bg-gray-200 mb-2 relative">
                        {rec.artist.profileImage ? (
                          <img src={rec.artist.profileImage} alt={rec.artist.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                          추천
                        </div>
                      </div>
                      <p className="font-semibold text-sm truncate">{rec.artist.name}</p>
                      <p className="text-xs text-gray-500 truncate">{rec.reason}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 모든 아티스트 */}
            <section>
              <h2 className="text-2xl font-bold mb-4">모든 아티스트</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {artists.map((artist) => (
                  <Link
                    key={artist._id}
                    to={`/artist/${artist._id}`}
                    className="text-center"
                  >
                    <div className="w-full aspect-square rounded-full overflow-hidden bg-gray-200 mb-2">
                      {artist.profileImage ? (
                        <img src={artist.profileImage} alt={artist.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-sm truncate">{artist.name}</p>
                    <p className="text-xs text-gray-500">{artist.followerCount} 팬</p>
                  </Link>
                ))}
              </div>
            </section>
          </>
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
    </nav>
  );
}
