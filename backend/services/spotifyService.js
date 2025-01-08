const axios = require('axios');

// Function to get Spotify access token
exports.getSpotifyToken = async (code, refreshToken) => {
  const body = refreshToken
    ? {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }
    : {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
      };

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams(body),
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data; // Return entire response including access and refresh tokens
  } catch (error) {
    console.error('Error fetching Spotify token:', error.response?.data || error.message);
    throw new Error('Failed to fetch Spotify token');
  }
};

exports.getSpotifyUserProfile = async (accessToken) => {
  try {
    // Fetch user profile
    const userProfileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Fetch top artists
    const topArtistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists?limit=3', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Fetch top tracks
    const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=3', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userProfile = userProfileResponse.data;
    const topArtists = topArtistsResponse.data.items.map(artist => ({
      name: artist.name,
      image: artist.images?.[0]?.url || null,
    }));

    const topTracks = topTracksResponse.data.items.map(track => ({
      name: track.name,
      artist: track.artists[0]?.name || 'Unknown Artist',
      image: track.album?.images?.[0]?.url || null,
    }));

    return {
      id: userProfile.id,
      displayName: userProfile.display_name,
      email: userProfile.email,
      profilePicture: userProfile.images?.[0]?.url || null,
      coolFact: {
        topArtists,
        topTracks,
      },
    };
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw new Error('Failed to fetch user profile');
  }
};




// Function to fetch playlists from the current user
exports.getSpotifyPlaylists = async (accessToken) => {
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching playlists:', error.response?.data || error.message);
    throw new Error('Failed to fetch playlists');
  }
};

// Function to fetch tracks from a specific playlist
exports.getSpotifyPlaylistTracks = async (accessToken, playlistId, offset = 0, limit = 100) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        offset,
        limit,
      },
    });

    const tracks = response.data.items.map((item) => {
      if (item.track) {
        const track = item.track;
        return {
          id: track.id,
          name: track.name,
          artist: track.artists.map((artist) => artist.name).join(', '),
          album: track.album.name,
          duration: track.duration_ms,
          images: track.album?.images,
        };
      }
      return null;
    });

    return {
      tracks: tracks.filter((track) => track !== null),
      total: response.data.total,
      next: response.data.next, 
    };
  } catch (error) {
    console.error('Error fetching playlist tracks:', error.response?.data || error.message);
    throw new Error('Failed to fetch playlist tracks');
  }
};


exports.getSpotifyTrackFeatures = async (accessToken, trackId) => {
  try {
    const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching track features:', error.response?.data || error.message);
    throw new Error('Failed to fetch track features');
  }
};

exports.getSpotifyMultipleTrackFeatures = async (accessToken, trackIds) => {
  try {
    const idsParam = trackIds.join(',');
    const response = await axios.get(`https://api.spotify.com/v1/audio-features?ids=${idsParam}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('Response headers:', response.headers);
    console.log('Response data:', response.data);
    return response.data.audio_features;
  } catch (error) {
    console.error('Error fetching multiple track features:', error.response?.data || error.message);
    throw new Error('Failed to fetch multiple track features');
  }
};
