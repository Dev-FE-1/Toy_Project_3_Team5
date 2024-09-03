import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { getSearchPlaylist } from '@/api/tempSearchPlaylist';
import PlaylistCard from '@/components/PlaylistCard';

const Search: React.FC = () => {
  const { keyword } = useParams();
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playlistsData = await getSearchPlaylist(keyword || '');
        setPlaylists(playlistsData);
      } catch (error) {
        console.error('Error fetching playlists: ', error);
      }
    };

    fetchData();
  }, [keyword]);

  return (
    <div css={containerStyle}>
      <div css={playlistWrapperStyle}>
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            size='large'
            playlistItem={playlist}
          />
        ))}
      </div>
    </div>
  );
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

const playlistWrapperStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default Search;
