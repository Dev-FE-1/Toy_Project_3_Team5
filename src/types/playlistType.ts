export interface PlayListDataProps {
  playlistId: string;
  title: string;
  description: string;
  isPublic: boolean;
  likes: number;
  links: string[];
  regDate: string;
  tags: string[];
  thumbNail: string;
  thumbnailFile?: File;
  userId: string;
}
