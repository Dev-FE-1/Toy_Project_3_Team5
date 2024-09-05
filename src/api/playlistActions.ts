import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase/firbaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';

type PlaylistType = 'liked' | 'saved';

const updateUserPlaylists = async (
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

const updatePlaylistLikes = async (
  playlistId: number,
  incrementValue: number
) => {
  const playlistDocRef = doc(db, 'playlist', playlistId.toString());

  await updateDoc(playlistDocRef, {
    likes: increment(incrementValue),
  });
};

export const useUpdateUserPlaylists = () => {
  const { user, userId, likedPlaylist, savedPlaylist } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutate: updatePlaylists } = useMutation({
    mutationFn: async ({
      playlistType,
      playlistId,
      isPlus,
    }: {
      playlistType: PlaylistType;
      playlistId: number;
      isPlus?: boolean;
    }) => {
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      const playlistData =
        playlistType === 'liked' ? likedPlaylist : savedPlaylist;

      await updateUserPlaylists(userId, playlistType, playlistData);

      if (isPlus) {
        const incrementValue = isPlus ? 1 : -1;
        await updatePlaylistLikes(playlistId, incrementValue);
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
