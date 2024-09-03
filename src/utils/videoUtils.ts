const example = [
  'https://www.youtube.com/watch?v=MvbWDw8mWAY&ab_channel=%EB%AA%BD%ED%82%A4%EB%A7%A4%EC%A7%81%EA%B2%8C%EC%9E%84%EC%B1%84%EB%84%90',
  'https://youtu.be/MvbWDw8mWAY?si=qU9NoablEFldSib6',
  'https://www.youtube.com/embed/MvbWDw8mWAY?si=qU9NoablEFldSib6',
];

const Regex: Record<string, RegExp> = {
  // youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i,
  youtube:
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/i,
};

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

const getVideoId = (link: string, type: LinkType) => {
  const videoId = link.match(Regex[type])?.[1];
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
