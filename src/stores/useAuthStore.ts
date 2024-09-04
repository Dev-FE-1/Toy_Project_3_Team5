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
import defaultProfile from '@/assets/profile_default.png';
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
  fetchUserData: (id: string) => void;
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

          set({
            profileImage: data?.profileImg || defaultProfile,
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
    const userIdFromEmail = email.split('@')[0];

    const usersCollectionRef = collection(db, 'users');
    const userQuery = query(usersCollectionRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const { id } = userDoc;

      useAuthStore.setState({ userId: userIdFromEmail });

      fetchUserData(id);
    } else {
      console.error('User not found in Firestore');
    }
  } else {
    useAuthStore.getState().clearUser();
  }
});
