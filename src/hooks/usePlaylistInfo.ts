import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPlaylist, getPlaylistInfo } from '@/api/playlist';
import { getVideoInfo } from '@/api/video';
import { Tag } from '@/components/HashTag';
import { AddedLinkProps } from '@/components/playlist/AddedVideo';
import { TEXT } from '@/constants/playlist';
import ROUTES from '@/constants/route';
import { Regex } from '@/constants/validation';
import useToast from '@/hooks/useToast';
import { useAuthStore } from '@/stores/useAuthStore';
import { PlayListDataProps } from '@/types/playlistType';
import { tagging } from '@/utils/textUtils';
import { getVideoId } from '@/utils/videoUtils';

const INIT_VALUES: {
  hashtag: string;
  preview: PlayListDataProps;
} = {
  hashtag: '',
  preview: {
    title: '임시 제목',
    userId: '임시 유저',
    ownerChannelName: '',
    tags: ['#임시1'],
    likes: 0,
    description: '임시 설명',
    isPublic: true,
    playlistId: '임시 PL ID',
    regDate: new Date().toISOString(),
    thumbnail: '/src/assets/logoIcon.png',
    links: [],
  },
};

interface ThumbnailProps {
  file: File;
  preview: string;
}

const usePlaylistInfo = (playlistId: number) => {
  const [playlistInfo, setPlaylistInfo] = useState<PlayListDataProps>(
    INIT_VALUES.preview
  );

  const [enabled, setEnabled] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [desc, setDesc] = useState<string>('');

  const [link, setLink] = useState<string>('');
  const [videoList, setVideoList] = useState<AddedLinkProps[]>([]);

  const [hashtag, setHashtag] = useState<string>('');
  const [addedHashtag, setAddedHashtag] = useState<Tag[]>([]);

  const [thumbnail, setThumbnail] = useState<ThumbnailProps | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<PlayListDataProps>(
    INIT_VALUES.preview
  );

  const { userId, channelName } = useAuthStore();

  const { toastTrigger } = useToast();
  const navigate = useNavigate();

  const init = {
    hashtag: () => {
      setHashtag(INIT_VALUES.hashtag);
    },
    preview: () => {
      setPreview(INIT_VALUES.preview);
    },
  };

  const onKeydown = {
    link: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') onClick.addVideoLink();
    },
    hashtag: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') onClick.addHashtag();
    },
  };

  const validation = {
    link: (value: string) => {
      if (!Regex.youtube.test(value)) return TEXT.link.validmsg;
      const videoId = getVideoId(value);
      if (!!!videoId) return TEXT.link.validmsg;
      if (videoId && check.dupl.link(videoId)) return TEXT.link.validDuplmsg;
      return '';
    },
    hashtag: (value: string) => {
      if (value.trim().length < 1 || value.trim() === '#') {
        toastTrigger(TEXT.hashtag.required, 'fail');
        return false;
      }
      if (addedHashtag.length >= 5) {
        toastTrigger(TEXT.hashtag.limit, 'fail');
        return false;
      }
      const taggedValue = tagging(value);
      if (check.dupl.hashtag(taggedValue)) {
        toastTrigger(TEXT.hashtag.validDuplmsg, 'fail');
        return false;
      }
      return true;
    },
  };

  const methods = {
    onFileUpload: () => {
      fileInputRef.current?.click();
    },
    createPreview: () => {
      setPreview({
        title,
        userId: userId ?? '',
        tags: addedHashtag.map((tag) => tag.label),
        likes: 0,
        description: desc,
        isPublic: enabled,
        regDate: new Date().toISOString(),
        ownerChannelName: channelName,
        thumbnail:
          thumbnail?.preview ??
          (videoList.length > 0
            ? videoList[0].imgUrl
            : INIT_VALUES.preview.thumbnail),
        links: [...videoList.map((video) => video.link)],
      });
    },
  };

  const onClick = {
    addVideoLink: async () => {
      if (validation.link(link)) {
        return;
      }
      const { status, result } = await getVideoInfo(link);
      console.log(status, result);
      if (status === 'fail' || !!!result) {
        toastTrigger(TEXT.link.validmsg, 'fail');
        return;
      }

      setVideoList([...videoList, result]);
      setLink('');
    },
    removeVideoLink: (videoId: string) => {
      setVideoList(videoList.filter((video) => video.videoId !== videoId));
    },
    removeThumbnail: () => {
      setThumbnail(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    addHashtag: () => {
      if (!!!validation.hashtag(hashtag)) return;
      const taggedValue = tagging(hashtag);

      setAddedHashtag([
        ...addedHashtag,
        {
          id:
            addedHashtag.length < 1
              ? addedHashtag.length
              : addedHashtag[addedHashtag.length - 1].id + 1,
          label: taggedValue,
          removable: true,
        },
      ]);
      init.hashtag();
    },
    removeHashtag: (id: number) => {
      setAddedHashtag(addedHashtag.filter((tag) => tag.id !== id));
    },
    createPlaylist: async () => {
      const checkResult = check.required();
      if (!!!checkResult.status) {
        toastTrigger(checkResult.msg, 'fail');
        return;
      }

      const playlist: PlayListDataProps = {
        ...preview,
        thumbnailFile: thumbnail?.file,
      };

      const response = await addPlaylist(playlist);

      if (response.status === 'success') {
        toastTrigger(TEXT.toast.success);
        navigate(ROUTES.PLAYLIST(userId));
      }
    },
  };

  const check = {
    required: (): {
      status: boolean;
      msg: string;
    } => {
      if (title.trim().length < 1)
        return { status: false, msg: TEXT.title.required };
      if (videoList.length < 1)
        return { status: false, msg: TEXT.link.required };
      if (addedHashtag.length < 1)
        return {
          status: false,
          msg: TEXT.hashtag.required,
        };

      return { status: true, msg: '' };
    },
    dupl: {
      hashtag: (inputTag: string): boolean => {
        let result = false;

        addedHashtag.map((hashtag) => {
          if (hashtag.label === inputTag) return (result = true);
        });
        return result;
      },
      link: (videoId: string): boolean => {
        let result = false;
        videoList.map((video) => {
          if (video.videoId === videoId) return (result = true);
        });
        return result;
      },
    },
  };

  const onChange = {
    title: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTitle(e.target.value);
    },
    description: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setDesc(e.target.value);
    },
    link: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLink(e.target.value);
    },
    hashtag: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setHashtag(e.target.value);
    },
    thumbnail: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setThumbnail({ file, preview: reader.result as string });
        };
      }
    },
  };

  useEffect(() => {
    (async () => {
      setPlaylistInfo(await getPlaylistInfo(playlistId));
    })();
  }, []);

  return { playlistInfo };
};

export default usePlaylistInfo;
