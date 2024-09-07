export interface ApiResponse<T> {
  status: 'success' | 'fail';
  result?: T;
}

export interface UserProps {
  channelFollower: string[];
  channelFollowing: string[];
  channelName: string;
  profileImg: string;
  isMyChannel: boolean;
  userId: string;
}
