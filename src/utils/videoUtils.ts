import { Regex } from '@/constants/validation';

const example = [
  'https://www.youtube.com/watch?v=n6B5gQXlB-0&ab_channel=HYBELABELS',
  'https://youtu.be/n6B5gQXlB-0?si=k1ddkQxbXNPD7_ph',
  'https://www.youtube.com/embed/n6B5gQXlB-0?si=k1ddkQxbXNPD7_ph',
];

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

const getLinkType = (link: string): LinkType => {
  if (Regex.youtube.test(link)) return 'youtube';
  return 'vimeo';
};

export const getVideoId = (link: string, type: LinkType = 'youtube') => {
  const videoId = link.match(Regex.youtube)?.[1];
  // if (!!!videoId) return { status: 'fail' };
  return videoId;
};

const makeEmbedUrl = (videoId: string, type: LinkType) => {
  if (type === 'youtube') return `https://www.youtube.com/embed/${videoId}`;
};

const getThumbnail = (videoId: string, type: LinkType) => {
  if (type === 'youtube') return `https://i.ytimg.com/vi/${videoId}/hq720.jpg`;
};

const getVideoInfo = (link: string): MethodResult<VideoInfoProps> => {
  const linkType = getLinkType(link);
  if (!!!linkType) return { status: 'fail' };

  const videoId = getVideoId(link, linkType);
  if (!!!videoId) return { status: 'fail' };

  const embedUrl = makeEmbedUrl(videoId, linkType);
  if (!!!embedUrl) return { status: 'fail' };

  const thumbnail = getThumbnail(videoId, linkType);
  if (!!!thumbnail) return { status: 'fail' };

  return { status: 'success', result: { embedUrl, thumbnail, link } };
};
