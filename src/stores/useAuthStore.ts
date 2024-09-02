import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { auth, db, onUserStateChanged } from '@/firebase/firbaseConfig';

interface AuthState {
  user: User | null;
  profileImage: string;
  channelName: string;
  playlistCount: number;
  followerCount: number;
  followingCount: number;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  fetchUserData: (uid: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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
  fetchUserData: async (uid) => {
    const userDocRef = doc(db, 'users', uid);
    const docSnapshot = await getDoc(userDocRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      set({
        profileImage: data?.profileImg || '',
        channelName: data?.channelName || '',
        playlistCount: data?.followingPlaylist?.length || 0,
        followerCount: data?.channelFollower?.length || 0,
        followingCount: data?.channelFollowing?.length || 0,
      });
    }
  },
}));

onUserStateChanged((user) => {
  const { setUser, fetchUserData } = useAuthStore.getState();
  setUser(user);
  if (user) {
    fetchUserData(user.uid);
  }
});
