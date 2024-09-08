import { Regex } from '@/constants/validation';

export interface VideoInfoProps {
  link: string;
  embedUrl?: string;
  embedHtml?: string;
  thumbnail: string;
}

export const getVideoId = (link: string): string => {
  let videoId = '';
  for (const key in Regex) {
    const matchData = link.match(Regex[key]);
    if (matchData) {
      videoId = link.match(Regex[key])?.[1] as string;
      return videoId;
    }
  }
  return videoId;
};
