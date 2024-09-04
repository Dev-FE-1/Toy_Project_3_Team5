export interface PlayListDataProps {
  playlistId?: string;
  title: string;
  description?: string;
  isPublic: boolean;
  likes: number;
  links: string[];
  regDate: string;
  tags: string[];
  thumbnail: string;
  thumbnailFile?: File;
  userId: string;
  ownerChannelName: string;
  commentCount?: number;
}
