import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';

type PlaylistType = 'liked' | 'saved';

export const updateUserPlaylists = async (
  userId: string,
  playlistType: PlaylistType,
  playlistData: number[]
): Promise<void> => {
  const userDocRef = doc(db, 'users', userId);

  const updateData =
    playlistType === 'liked'
      ? { likedPlaylist: playlistData }
      : { savedPlaylist: playlistData };

  await updateDoc(userDocRef, updateData);
};

export const updatePlaylistLikes = async (
  playlistId: number,
  newLikes: number
) => {
  const playlistDocRef = doc(db, 'playlist', playlistId.toString());

  await updateDoc(playlistDocRef, {
    likes: newLikes,
  });
};

export const useUpdateUserPlaylists = () => {
  const { user, userId, likedPlaylist, savedPlaylist } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutate: updatePlaylists } = useMutation({
    mutationFn: async ({
      playlistType,
      playlistId,
      newLikes,
    }: {
      playlistType: PlaylistType;
      playlistId: number;
      newLikes?: number;
    }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      const playlistData =
        playlistType === 'liked' ? likedPlaylist : savedPlaylist;

      await updateUserPlaylists(userId, playlistType, playlistData);

      if (newLikes !== undefined) {
        await updatePlaylistLikes(playlistId, newLikes);
      }
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
      }
    },
    onError: (error: Error) => {
      console.error(error.message);
    },
  });

  return { updatePlaylists };
};
