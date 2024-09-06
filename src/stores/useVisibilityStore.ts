import { doc, updateDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from '@/firebase/firbaseConfig';

interface PlaylistVisibility {
  [playlistId: string]: boolean;
}

interface PlaylistVisibilityState {
  visibilities: PlaylistVisibility;
  toggleVisibility: (playlistId: string) => Promise<void>;
  setInitialVisibility: (playlistId: string, isPublic: boolean) => void;
}

export const useVisibilityStore = create<PlaylistVisibilityState>(
  (set, get) => ({
    visibilities: {},
    toggleVisibility: async (playlistId: string) => {
      try {
        const currentVisibility = get().visibilities[playlistId];
        const playlistRef = doc(db, 'playlist', playlistId);
        await updateDoc(playlistRef, {
          isPublic: !currentVisibility,
        });

        set((state) => ({
          visibilities: {
            ...state.visibilities,
            [playlistId]: !currentVisibility,
          },
        }));
      } catch (err) {
        console.error('재생 목록 공개/비공개 업데이트 중 오류 발생:', err);
      }
    },
    setInitialVisibility: (playlistId: string, isPublic: boolean) => {
      set((state) => ({
        visibilities: { ...state.visibilities, [playlistId]: isPublic },
      }));
    },
  })
);
