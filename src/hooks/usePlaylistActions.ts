import { useEffect, useState } from 'react';
import useToast from '@/hooks/useToast';
import { useAuthStore } from '@/stores/useAuthStore';

const usePlaylistActions = (playlistId: number) => {
  const {
    likedPlaylist,
    savedPlaylist,
    user,
    addLikedPlaylistItem,
    removeLikedPlaylistItem,
    addSavedPlaylistItem,
    removeSavedPlaylistItem,
  } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { toastTrigger } = useToast();

  useEffect(() => {
    if (user && playlistId) {
      setIsLiked(likedPlaylist.includes(playlistId));
      setIsAdded(savedPlaylist.includes(playlistId));
    }
  }, [user, playlistId, likedPlaylist, savedPlaylist]);

  const toggleLike = () => {
    if (!user) {
      toastTrigger('로그인이 필요합니다.');
      return;
    }

    if (isLiked) {
      removeLikedPlaylistItem(playlistId);
      setIsLiked(false);
    } else {
      addLikedPlaylistItem(playlistId);
      setIsLiked(true);
    }
  };

  const toggleSave = () => {
    if (!user) {
      toastTrigger('로그인이 필요합니다.');
      return;
    }

    if (isAdded) {
      removeSavedPlaylistItem(playlistId);
      setIsAdded(false);
    } else {
      addSavedPlaylistItem(playlistId);
      setIsAdded(true);
    }
  };

  return { isLiked, isAdded, toggleLike, toggleSave };
};

export default usePlaylistActions;
