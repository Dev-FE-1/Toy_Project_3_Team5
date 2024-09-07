import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { PlusSquare, SquarePlus, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPlaylistInfo, updatePlaylist } from '@/api/playlistInfo';
import { getVideoInfo } from '@/api/video';
import Button from '@/components/Button';
import HashTag, { Tag } from '@/components/HashTag';
import IconButton from '@/components/IconButton';
import InputBox from '@/components/InputBox';
import AddedVideo, { AddedLinkProps } from '@/components/playlist/AddedVideo';
import PlaylistCard from '@/components/PlaylistCard';
import Toggle from '@/components/Toggle';
import colors from '@/constants/colors';
import { fontSize, fontWeight } from '@/constants/font';
import { TEXT } from '@/constants/playlist';
import ROUTES from '@/constants/route';
import useToast from '@/hooks/useToast';
import { useAuthStore } from '@/stores/useAuthStore';
import { PlayListDataProps, ThumbnailProps } from '@/types/playlistType';
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

const PlayListEdit = () => {
  const navigate = useNavigate();
  const { toastTrigger } = useToast();
  const { userId, channelName } = useAuthStore();

  const { playlistId } = useParams<string>();
  const [playlistInfo, setPlaylistInfo] = useState<PlayListDataProps>();

  const [enabled, setEnabled] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [desc, setDesc] = useState<string>('');

  const [link, setLink] = useState<string>('');
  const [videoList, setVideoList] = useState<AddedLinkProps[]>([]);

  const [hashtag, setHashtag] = useState<string>('');
  const [addedHashtag, setAddedHashtag] = useState<Tag[]>([]);

  const [prevThumbnail, setPrevThumbnail] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<ThumbnailProps | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<PlayListDataProps>(
    INIT_VALUES.preview
  );

  const init = {
    all: async (values: PlayListDataProps) => {
      setEnabled(values.isPublic);
      setTitle(values.title);
      setDesc(values.description ?? '');

      values.links.map(async (link) => {
        const { status, result } = await getVideoInfo(link);
        if (status === 'success' && result) {
          setVideoList((prev) => [...prev, result]);
        }
      });

      values.tags.map(async (tag) => {
        addedHashtag.push({
          id:
            addedHashtag.length < 1
              ? addedHashtag.length
              : addedHashtag[addedHashtag.length - 1].id + 1,
          label: tag,
          removable: true,
        });
      });

      setPrevThumbnail(values.thumbnail);
    },
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
          prevThumbnail ??
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
      if (prevThumbnail) {
        setPrevThumbnail(null);
        return;
      }
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
    removeHashtag: (label: string) => {
      setAddedHashtag(addedHashtag.filter((tag) => tag.label !== label));
    },
    modifyPlaylist: async () => {
      const checkResult = check.required();
      if (!!!checkResult.status) {
        toastTrigger(checkResult.msg, 'fail');
        return;
      }

      const playlist: PlayListDataProps = {
        ...preview,
        thumbnailFile: thumbnail?.file,
      };

      const response = await updatePlaylist(playlist, Number(playlistId));

      if (response.status === 'success') {
        toastTrigger(TEXT.toast.modify);
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
          if (video.videoId.toString() === videoId) return (result = true);
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
      const data = await getPlaylistInfo(Number(playlistId));
      if (data.result) setPlaylistInfo(data.result);
    })();
  }, []);

  useEffect(() => {
    if (playlistInfo) init.all(playlistInfo);
  }, [playlistInfo]);

  useEffect(() => {
    methods.createPreview();
  }, [enabled, title, addedHashtag, videoList, thumbnail, prevThumbnail]);

  return (
    <div css={containerStyle}>
      <div css={toggleStyle}>
        <Toggle
          enabled={enabled}
          setEnabled={setEnabled}
          label={{ active: TEXT.toggle.active }}
        />
      </div>

      <InputBox
        label={TEXT.title.label}
        placeholder={TEXT.title.placeholder}
        labelStyle={labelStyle}
        value={title}
        onChange={onChange.title}
      />
      <InputBox
        label={TEXT.desc.label}
        placeholder={TEXT.desc.placeholder}
        labelStyle={labelStyle}
        isTextarea={true}
        value={desc}
        onChange={onChange.description}
        height='100px'
      />
      <div css={linkStyle}>
        <InputBox
          label={TEXT.link.label}
          placeholder={TEXT.link.placeholder}
          labelStyle={labelStyle}
          value={link}
          width='360px'
          onChange={onChange.link}
          onKeyDown={onKeydown.link}
          validate={validation.link}
        />
        <IconButton IconComponent={PlusSquare} onClick={onClick.addVideoLink} />
      </div>
      {videoList.length > 0 && (
        <div css={videoListStyle}>
          {videoList.map((video, index) => (
            <div css={videoItemStyle} key={index}>
              <AddedVideo
                videoId={video.videoId}
                imgUrl={video.imgUrl}
                link={video.link}
                title={video.title}
                userName={video.userName}
                onRemove={onClick.removeVideoLink}
                isDragNDrop={true}
                onDragNDrop={() => {}}
              />
            </div>
          ))}
        </div>
      )}
      <div css={hashtagDivStyle}>
        <InputBox
          label={TEXT.hashtag.label}
          description={TEXT.hashtag.desc}
          placeholder={TEXT.hashtag.placeholder}
          labelStyle={labelStyle}
          value={hashtag}
          onChange={onChange.hashtag}
          onKeyDown={onKeydown.hashtag}
        />
        <HashTag onRemove={onClick.removeHashtag} tags={addedHashtag} />
      </div>
      <div css={thumbnailStyle}>
        <label style={labelStyle}>{TEXT.thumbnail.label}</label>
        <label
          style={{ fontSize: `${fontSize.sm}`, color: `${colors.gray04}` }}
        >
          {TEXT.thumbnail.desc}
        </label>

        <Button
          label='Image Upload'
          IconComponent={SquarePlus}
          onClick={methods.onFileUpload}
          shape='line'
          size='md'
          color='gray'
          type='button'
        />
        <input
          type='file'
          name='thumbnail'
          style={{ display: 'none' }}
          onChange={onChange.thumbnail}
          ref={fileInputRef}
          accept='image/png'
        />
        {(prevThumbnail || thumbnail) && (
          <Button
            label='이미지 삭제'
            IconComponent={X}
            onClick={onClick.removeThumbnail}
            shape='block'
            size='md'
            color='red'
            type='button'
          />
        )}
      </div>
      <div css={previewStyle}>
        <label style={labelStyle}>{TEXT.preview.large}</label>
        <PlaylistCard playlistItem={preview} size='large' />
        <label style={labelStyle}>{TEXT.preview.small}</label>
        <PlaylistCard playlistItem={preview} size='small' />
      </div>

      <Button
        label={TEXT.modifyButton.label}
        onClick={onClick.modifyPlaylist}
        color='primary'
        size='md'
        fullWidth
      />
    </div>
  );
};

const containerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  padding-bottom: 60px;

  & > div {
    padding: 5px 0;
    width: 100%;
  }
`;

const labelStyle = {
  fontSize: `${fontSize.lg}`,
  fontWeight: `${fontWeight.bold}`,
};

const toggleStyle = css`
  width: 100%;

  & button {
    padding-right: 5px;
  }

  & span {
    align-self: center;
  }
`;

const linkStyle = css`
  display: flex;
  align-self: center;
  width: 100%;
`;

const videoListStyle = css`
  /* width: 100%; */
  /* overflow-y: auto;
  overflow-x: hidden; */
`;

const videoItemStyle = css`
  display: flex;
`;

const hashtagDivStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const thumbnailStyle = css`
  display: flex;
  flex-direction: column;
  width: 100%;

  & label {
    padding: 5px 0;
  }
`;

const previewStyle = css`
  width: 100%;
  & > * {
    padding: 10px 0;
  }
`;

export default PlayListEdit;
