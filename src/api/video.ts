import axios from 'axios';
import { AddedLinkProps } from '@/components/playlist/AddedVideo';
import { ApiResponse } from '@/types/api';

export const getVideoInfo = async (
  link: string
): Promise<ApiResponse<AddedLinkProps>> => {
  const { data } = await axios.get(`https://noembed.com/embed?url=${link}`);
  if (!!!data) return { status: 'fail' };

  if (!!data.error) return { status: 'fail' };

  let videoId = '';
  if (data.provider_name === 'YouTube')
    videoId = data.thumbnail_url.split('/')[4];

  return {
    status: 'success',
    result: {
      videoId,
      onRemove: () => {},
      imgUrl: data.thumbnail_url,
      link,
      title: data.title,
      userName: data.author_name,
    },
  };
};
