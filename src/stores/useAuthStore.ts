import { User, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { auth, db } from '@/firebase/firbaseConfig';

interface AuthState {
  user: User | null;
  userId: string;
  profileImage: string;
  channelName: string;
  likedPlaylist: number[];
  savedPlaylist: number[];
  channelFollower: string[];
  channelFollowing: string[];
  tags: string[];
  isFirstLogin: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  fetchUserData: (userId: string) => void;
  addLikedPlaylistItem: (playlistId: number) => void;
  addSavedPlaylistItem: (playlistId: number) => void;
  removeLikedPlaylistItem: (playlistId: number) => void;
  removeSavedPlaylistItem: (playlistId: number) => void;
}

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>
) => StateCreator<AuthState>;

export const useAuthStore = create<AuthState>(
  (persist as AuthPersist)(
    (set) => ({
      user: null,
      userId: '',
      profileImage: '',
      channelName: '',
      likedPlaylist: [],
      savedPlaylist: [],
      channelFollower: [],
      channelFollowing: [],
      tags: [],
      isFirstLogin: true,
      setUser: (user) => set({ user }),
      clearUser: () =>
        set({
          user: null,
          profileImage: '',
        }),
      fetchUserData: async (id) => {
        const userDocRef = doc(db, 'users', id);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();

          console.log(id);
          console.log(data);

          set({
            profileImage: data?.profileImg || '',
            channelName: data?.channelName || '',
            likedPlaylist: data?.likedPlaylist || [],
            savedPlaylist: data?.savedPlaylist || [],
            channelFollower: data?.channelFollower || [],
            channelFollowing: data?.channelFollowing || [],
            tags: data?.tags || [],
            isFirstLogin: data?.isFirstLogin ?? true,
          });
        }
      },
      addLikedPlaylistItem: (playlistId) =>
        set((state) => ({
          likedPlaylist: [...state.likedPlaylist, playlistId],
        })),
      addSavedPlaylistItem: (playlistId) =>
        set((state) => ({
          savedPlaylist: [...state.savedPlaylist, playlistId],
        })),
      removeLikedPlaylistItem: (playlistId) =>
        set((state) => ({
          likedPlaylist: state.likedPlaylist.filter((i) => i !== playlistId),
        })),
      removeSavedPlaylistItem: (playlistId) =>
        set((state) => ({
          savedPlaylist: state.savedPlaylist.filter((i) => i !== playlistId),
        })),
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

export const updateFirstLogin = async (userId: string, tags: string[]) => {
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, {
    isFirstLogin: false,
    tags,
  });
};

onAuthStateChanged(auth, async (user) => {
  const { setUser, fetchUserData } = useAuthStore.getState();
  setUser(user);
  if (user) {
    const email = user.email || '';
    const userId = email.split('@')[0];

    const usersCollectionRef = collection(db, 'users');
    const userQuery = query(usersCollectionRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      useAuthStore.setState({ userId });

      fetchUserData(userId);
    } else {
      console.error('User not found in Firestore');
    }
  } else {
    useAuthStore.getState().clearUser();
  }
});
