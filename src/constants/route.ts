// src/constants/routes.js

const ROUTES = {
  ROOT: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  HASH_TAG: '/hashtag',
  POPULAR: '/popular',
  FOLLOWING: '/following',
  FOLLOWING_LIST: (userId = ':userId') => `/following/${userId}`,
  DETAIL: (playListId = ':playlistId') => `/detail/${playListId}`,
  SEARCH: (keyword = ':keyword') => `/search/${keyword}`,
  PLAYLIST: (userId = ':userId') => `/playlist/${userId}`,
  PLAYLIST_SAVED: (userId = ':userId') => `/playlist/${userId}/saved`,
  PLAYLIST_LIKES: (userId = ':userId') => `/playlist/${userId}/likes`,
  PLAYLIST_ADD: (userId = ':userId') => `/playlist/${userId}/add`,
  PLAYLIST_MODIFY: (playlistId = ':playlistId') =>
    `/playlist/${playlistId}/modify`,
  PROFILE: (userId = ':userId') => `/profile/${userId}`,
  PROFILE_MODIFY: (userId = ':userId') => `/profile/${userId}/modify`,
  PROFILE_FOLLOWER: (userId = ':userId') => `/profile/${userId}/follower`,
  PROFILE_FOLLOWING: (userId = ':userId') => `/profile/${userId}/following`,
  NOT_FOUND: '*',
};

export default ROUTES;
