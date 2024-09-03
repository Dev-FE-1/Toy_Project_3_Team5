// import {
//   query,
//   where,
//   orderBy,
//   collection,
//   limit,
//   getDocs,
// } from 'firebase/firestore';
// import { db } from '@/firebase/firbaseConfig';

// type tableType = 'playlist' | 'comments' | 'users';
// type PlaylistFields =
//   | 'description'
//   | 'isPublic'
//   | 'likes'
//   | 'links'
//   | 'regDate'
//   | 'tags'
//   | 'thumbnail'
//   | 'title'
//   | 'userId';
// type PlaylistArrayFields = 'links' | 'tags';
// type CommentsFields =
//   | 'content'
//   | 'isEditted'
//   | 'playlistId'
//   | 'regDate'
//   | 'userId';
// type UsersFields =
//   | 'channelFollower'
//   | 'channelFollowing'
//   | 'channelName'
//   | 'likedPlaylist'
//   | 'profileImg'
//   | 'savedPlaylist'
//   | 'tags'
//   | 'uid';
// type UsersArrayFields =
//   | 'channelFollower'
//   | 'channelFollowing'
//   | 'likedPlaylist'
//   | 'savedPlaylist'
//   | 'tags';
// // tableType에 따른 fieldType을 조건부 타입으로 설정
// type FieldType<T extends tableType> = T extends 'playlist'
//   ? PlaylistFields
//   : T extends 'comments'
//     ? CommentsFields
//     : T extends 'users'
//       ? UsersFields
//       : never;

// interface queryParameter {
//   table: tableType;
//   field: FieldType<tableType>;
//   filter: string | number | string[] | number[];
// }

// //플레이리스트 가져오기
// // 해시태그, 검색값,
// const getPlaylistsByAttribute = async ({
//   table,
//   field,
//   filter,
// }: queryParameter) => {
//   if (field) const q = query(collection(db, table), where(field, '==', filter));
//   const querySnapshot = await getDocs(q);
//   const playlists = [];
//   querySnapshot.forEach((doc) => {
//     playlists.push({ id: doc.id, ...doc.data() });
//   });

//   return playlists;
// };
// //유저 가져오기
// //팔로워 or 팔로잉 하는 사람 가져오기
// //
// //
// //마이플리페이지 정보 가져오기(유저 가져오기, 플레이리스트 가져오기)
