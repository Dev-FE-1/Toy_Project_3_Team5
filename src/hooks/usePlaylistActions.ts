import { useEffect, useState } from 'react';
import { useUpdateUserPlaylists } from '@/api/playlistActions';
import useToast from '@/hooks/useToast';
import { useAuthStore } from '@/stores/useAuthStore';

const usePlaylistActions = (playlistId: number, initialLikes: number) => {
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
  const [isLiked, setIsLiked] = useState(likedPlaylist.includes(playlistId));
  const [isAdded, setIsAdded] = useState(savedPlaylist.includes(playlistId));
  const [likes, setLikes] = useState<number>(initialLikes);
  const { toastTrigger } = useToast();

  const toggleLike = async () => {
    if (!user) {
      toastTrigger('로그인이 필요합니다.');
      return;
    }

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    const newLikes = newIsLiked ? likes + 1 : likes - 1;
    setLikes(newLikes);

    if (newIsLiked) {
      addLikedPlaylistItem(playlistId);
    } else {
      removeLikedPlaylistItem(playlistId);
    }

    await updatePlaylists({
      playlistType: 'liked',
      playlistId,
      newLikes,
    });
  };

  const toggleSave = () => {
    if (!user) {
      toastTrigger('로그인이 필요합니다.');
      return;
    }

    const newIsAdded = !isAdded;
    setIsAdded(newIsAdded);

    if (newIsAdded) {
      addSavedPlaylistItem(playlistId);
    } else {
      removeSavedPlaylistItem(playlistId);
    }

    updatePlaylists({ playlistType: 'saved', playlistId });
  };

  useEffect(() => {
    setIsLiked(likedPlaylist.includes(playlistId));
    setIsAdded(savedPlaylist.includes(playlistId));
  }, [likedPlaylist, savedPlaylist, playlistId]);

  return { isLiked, isAdded, toggleLike, toggleSave, likes };
};

export default usePlaylistActions;
