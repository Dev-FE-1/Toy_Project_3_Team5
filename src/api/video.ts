import axios from 'axios';
import { AddedLinkProps } from '@/components/playlist/AddedVideo';
import { ApiResponse } from '@/types/api';
import { getVideoId } from '@/utils/videoUtils';

export const getVideoInfo = async (
  link: string
): Promise<ApiResponse<AddedLinkProps>> => {
  try {
    const { data } = await axios.get(`https://noembed.com/embed?url=${link}`);
    if (!!!data) throw new Error('링크 변환중 오류가 발생했습니다.');

    if (!!data.error) throw new Error('링크 변환중 오류가 발생했습니다.');

    return {
      status: 'success',
      result: {
        videoId: data.video_id ?? getVideoId(link),
        onRemove: () => {},
        imgUrl: data.thumbnail_url,
        link,
        title: data.title,
        userName: data.author_name,
        embedCode: data.html,
        provider: data.provider_name,
      },
    };
  } catch (err) {
    console.error(err);
    return { status: 'fail' };
  }
};
