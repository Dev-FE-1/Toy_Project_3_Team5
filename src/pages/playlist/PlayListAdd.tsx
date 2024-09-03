import { useEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { PlusSquare, SquarePlus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addPlaylist } from '@/api/playlist';
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
import ROUTES from '@/constants/route';
import useToast from '@/hooks/useToast';
import { useAuthStore } from '@/stores/useAuthStore';
import { PlayListDataProps } from '@/types/playlistType';
import { tagging } from '@/utils/textUtils';

const TEXT = {
  title: {
    label: '플레이리스트 제목',
    placeholder: '플레이리스트 제목을 입력해주세요.',
  },
  desc: {
    label: '플레이리스트 설명',
    placeholder: '플레이리스트에 대한 설명을 남겨주세요.',
  },
  link: {
    label: '영상 링크 추가',
    placeholder: '영상 링크를 입력해주세요.',
    validmsg: '지원하지 않는 영상입니다.',
  },
  hashtag: {
    label: '해시태그',
    desc: '최대 5개까지 입력 가능합니다.',
    placeholder: '#',
  },
  createButton: { label: '플레이리스트 생성하기', loading: '생성 중...' },
  toggle: { active: '공개', inactive: '비공개' },
  toast: { success: '플레이리스트 생성이 완료되었습니다.' },
};

const INIT_VALUES: {
  hashtag: string;
  preview: PlayListDataProps;
} = {
  hashtag: '',
  preview: {
    title: '임시 제목',
    userId: '임시 유저',
    tags: ['#임시1'],
    likes: 0,
    description: '임시 설명',
    isPublic: true,
    playlistId: '임시 PL ID',
    regDate: new Date().toISOString(),
    thumbNail: '/src/assets/defaultThumbnail.jpg',
    links: [],
  },
};

interface ThumbnailProps {
  file: File;
  preview: string;
}

const PlayListAdd = () => {
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

  const [resultPlaylist, setResultPlaylist] = useState<PlayListDataProps>(
    INIT_VALUES.preview
  );

  const { user } = useAuthStore();
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

  // 모든 동작? 같은 이름을 지어주고 싶은데
  const onKeydown = {
    link: (e: React.KeyboardEvent<HTMLInputElement>) => {
      // 입력 valid 체크
      // const valid = validation.hashtag;
      // if (e.key === ' ') console.log('a');
      if (e.key === 'Enter') onClick.addVideoLink();
    },
    hashtag: (e: React.KeyboardEvent<HTMLInputElement>) => {
      // 입력 valid 체크
      // const valid = validation.hashtag;
      // if (e.key === ' ') console.log('a');
      if (e.key === 'Enter') onClick.addHashtag();
    },
  };

  // true: 조건에 걸림, false: 통과
  const validation = {
    hashtag: {
      count: () => addedHashtag.length > 5,
      blank: () => hashtag.trim().length < 1,
      regex: () => {},
      cantSpace: (keycode: string) => keycode === 'Space',
    },
  };

  const methods = {
    onFileUpload: () => {
      fileInputRef.current?.click();
    },
    createPreview: () => {
      setPreview({
        title,
        userId: user?.uid ?? '',
        tags: addedHashtag.map((tag) => tag.label),
        likes: 0,
        description: desc,
        isPublic: enabled,
        playlistId: '임시 PL ID',
        regDate: new Date().toISOString(),
        thumbNail:
          thumbnail?.preview ??
          (videoList.length > 0
            ? videoList[0].imgUrl
            : INIT_VALUES.preview.thumbNail),
        links: [...videoList.map((video) => video.link)],
      });
    },
  };

  const onClick = {
    addVideoLink: async () => {
      const { status, result } = await getVideoInfo(link);
      if (status === 'fail' || !!!result) return;

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
      setResultPlaylist({
        ...preview,
        thumbNail: '',
        thumbnailFile: thumbnail?.file,
      });

      const response = await addPlaylist(resultPlaylist);

      if (response.status === 'success') {
        toastTrigger(TEXT.toast.success);
        navigate(ROUTES.PLAYLIST(user?.uid));
      }
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
    methods.createPreview();
  }, [enabled, title, addedHashtag, videoList, thumbnail]);

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
        <label style={labelStyle}>썸네일</label>
        <label
          style={{ fontSize: `${fontSize.sm}`, color: `${colors.gray04}` }}
        >
          플레이리스트 메인 썸네일을 선택해주세요.
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
        {thumbnail && (
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
        <label style={labelStyle}>미리보기(large)</label>
        <PlaylistCard playlistItem={preview} size='large' />
        <label style={labelStyle}>미리보기(small)</label>
        <PlaylistCard playlistItem={preview} size='small' />
      </div>

      {/* {enabled ? (
        <Button
          label={TEXT.createButton.label}
          onClick={onClick.createPlaylist}
          color='primary'
          size='md'
          fullWidth
        />
      ) : (
        <Button
          label={TEXT.createButton.loading}
          onClick={onClick.createPlaylist}
          color='lightGray'
          size='md'
          fullWidth
          disabled
        />
      )} */}
      <Button
        label={TEXT.createButton.label}
        onClick={onClick.createPlaylist}
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

export default PlayListAdd;
