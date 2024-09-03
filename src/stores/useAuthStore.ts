import { User, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { auth, db } from '@/firebase/firbaseConfig';

interface AuthState {
  user: User | null;
  profileImage: string;
  channelName: string;
  playlistCount: number;
  followerCount: number;
  followingCount: number;
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
      profileImage: '',
      channelName: '',
      playlistCount: 0,
      followerCount: 0,
      followingCount: 0,

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
            profileImage: data?.profileImg || '',
            channelName: data?.channelName || '',
            playlistCount: data?.savedPlaylist?.length || 0,
            followerCount: data?.channelFollower?.length || 0,
            followingCount: data?.channelFollowing?.length || 0,
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

onAuthStateChanged(auth, async (user) => {
  const { setUser, fetchUserData } = useAuthStore.getState();
  setUser(user);
  if (user) {
    const usersCollectionRef = collection(db, 'users');
    const userQuery = query(usersCollectionRef, where('uid', '==', user.uid));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const { id } = userDoc;
      fetchUserData(id);
    } else {
      console.error('User not found in Firestore');
    }
  } else {
    useAuthStore.getState().clearUser();
  }
});
