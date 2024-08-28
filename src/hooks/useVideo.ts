import { useEffect, useState } from 'react';

const TestData = {
  imgUrl: '/src/assets/defaultThumbnail.jpg',
  title: 'lofi hip hop radio 📚 - beats to relax/study to2',
  userName: 'Lofi Girl2',
};

const useVideo = () => {
  const [imgUrl, setImgUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  // convert link to video info
  // const result = await convertLinkToVideoInfo(link);

  // set video info
  // setImgUrl(result.imgUrl);
  // setTitle(result.title);
  // setUserName(result.userName);
  useEffect(() => {
    setImgUrl(TestData.imgUrl);
    setTitle(TestData.title);
    setUserName(TestData.userName);
  }, []);

  // return video info
  return { imgUrl, title, userName };
};

export default useVideo;
