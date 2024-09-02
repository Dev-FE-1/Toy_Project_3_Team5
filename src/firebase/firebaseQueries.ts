import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/firebase/firbaseConfig';
import { PlayListDataProps } from '@/hooks/usePlaylist';

// 플레이리스트 가져오기

// 최신순 좋아요순 댓글순
// 아이디를 받아서 그 아이디가 작성한 플레이리스트 가져오기
// 프로필에서 내 플리, 저장된 플리, 좋아요한 플리 가져오기
// 해당하는 태그가 포함된 플레이리스트 찾아서 가져오기
// 선택한 아이디의 플레이리스트 보기(팔로잉페이지)
// const fetchPlaylists: PlayListDataProps = () => {
// };

//프로필 가져오기

//프로필에서 가져온
