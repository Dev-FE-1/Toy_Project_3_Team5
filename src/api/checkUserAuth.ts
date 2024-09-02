import { User } from 'firebase/auth';
import { auth } from '@/firebase/firbaseConfig';

const checkUserAuth = (): User => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('현재 로그인된 사용자가 없습니다.');
  }
  return user;
};

export default checkUserAuth;
