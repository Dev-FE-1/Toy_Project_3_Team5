import { useEffect, useState } from 'react';

interface CommentDataProps {
  imgUrl: string;
  userName: string;
  content: string;
}

const TestData: CommentDataProps[] = [
  {
    imgUrl: '/src/assets/defaultThumbnail.jpg',
    userName: '머영',
    content: '5조 화이팅~ 5조 화이팅~ 5조 화이팅~ 5조 화이팅~ 5조 화이팅~',
  },
  {
    imgUrl: '/src/assets/defaultThumbnail.jpg',
    userName: '수미니',
    content: 'ㅎㅎㅎㅎㅎㅎㅎ',
  },
  {
    imgUrl: '/src/assets/defaultThumbnail.jpg',
    userName: 'ㄱㅎㅈ',
    content: 'ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ',
  },
];

const useComment = () => {
  const [comments, setComments] = useState<CommentDataProps[]>([]);

  useEffect(() => {
    setComments(TestData);
  }, []);

  return comments;
};

export default useComment;
