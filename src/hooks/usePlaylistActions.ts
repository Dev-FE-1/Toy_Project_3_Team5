import { useState } from 'react';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useUpdateUserPlaylists } from '@/api/playlistActions';
import useToast from '@/hooks/useToast';
import { useAuthStore } from '@/stores/useAuthStore';
import { PlayListDataProps } from '@/types/playlistType';

type QueryDataType = {
  pages: {
    playlistsData: PlayListDataProps[];
  }[];
};

const PAGES_QUERY: { [key: string]: string } = {
  '': 'homePlaylists',
  search: 'searchPlaylists',
  popular: 'popularPlaylists',
  following: 'followingPlaylists',
};

const updatePlaylistData = (
  queryClient: QueryClient,
  queryKey: string,
  playlistId: number,
  update: (playlist: PlayListDataProps) => PlayListDataProps
) => {
  queryClient.setQueriesData<QueryDataType>(
    { queryKey: [queryKey] },
    (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          playlistsData: page.playlistsData.map((playlist) =>
            playlist.playlistId === playlistId.toString()
              ? update(playlist)
              : playlist
          ),
        })),
      };
    }
  );
};

const usePlaylistActions = (playlistId: number, initialLikes: number) => {
  const queryClient = useQueryClient();
  const {
    likedPlaylist,
    savedPlaylist,
    user,
    addLikedPlaylistItem,
    removeLikedPlaylistItem,
    addSavedPlaylistItem,
    removeSavedPlaylistItem,
  } = useAuthStore();
  const { updatePlaylists } = useUpdateUserPlaylists();
  const { toastTrigger } = useToast();
  const location = useLocation();
  const page = location.pathname.split('/')[1];
  const queryKey = PAGES_QUERY[page];

  const isLiked = likedPlaylist.includes(playlistId);
  const isAdded = savedPlaylist.includes(playlistId);
  const [initLikes, setInitLikes] = useState<number>(initialLikes);

  const toggleLike = async () => {
    if (!user) {
      toastTrigger('로그인이 필요합니다.', 'fail');
      return;
    }

    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? initLikes + 1 : initLikes - 1;
    setInitLikes(newLikes);

    updatePlaylistData(queryClient, queryKey, playlistId, (playlist) => ({
      ...playlist,
      isLiked: newIsLiked,
      likes: newLikes,
    }));

    if (newIsLiked) {
      addLikedPlaylistItem(playlistId);
    } else {
      removeLikedPlaylistItem(playlistId);
    }

    try {
      await updatePlaylists({
        playlistType: 'liked',
        playlistId,
        newLikes,
      });
    } catch (error) {
      toastTrigger('좋아요를 실패했습니다.', 'fail');
      if (newIsLiked) {
        removeLikedPlaylistItem(playlistId);
      } else {
        addLikedPlaylistItem(playlistId);
      }
    }
  };

  const toggleSave = async () => {
    if (!user) {
      toastTrigger('로그인이 필요합니다.', 'fail');
      return;
    }

    const newIsAdded = !isAdded;

    updatePlaylistData(queryClient, queryKey, playlistId, (playlist) => ({
      ...playlist,
      isAdded: newIsAdded,
    }));

    if (newIsAdded) {
      addSavedPlaylistItem(playlistId);
    } else {
      removeSavedPlaylistItem(playlistId);
    }

    try {
      await updatePlaylists({ playlistType: 'saved', playlistId });
    } catch (error) {
      toastTrigger('저장에 실패했습니다.', 'fail');
      if (newIsAdded) {
        removeSavedPlaylistItem(playlistId);
      } else {
        addSavedPlaylistItem(playlistId);
      }
    }
  };

  return {
    isLiked,
    isAdded,
    toggleLike,
    toggleSave,
    likes: initLikes,
    setInitLikes,
  };
};

export default usePlaylistActions;
