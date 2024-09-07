import { Regex } from '@/constants/validation';

export interface MethodResult<T> {
  status: 'success' | 'fail';
  result?: T;
}

export interface VideoInfoProps {
  link: string;
  embedUrl?: string;
  embedHtml?: string;
  thumbnail: string;
}

type LinkType = 'youtube' | 'vimeo';

export const getVideoId = (
  link: string,
  type: LinkType = 'youtube'
): string => {
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

export const makeEmbedUrl = (videoId: string, type: LinkType) => {
  if (type === 'youtube') return `https://www.youtube.com/embed/${videoId}`;
  return `https://www.youtube.com/embed/${videoId}`;
};
