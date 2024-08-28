// src/constants/routes.js

const ROUTES = {
  ROOT: '/',
  SIGN_IN: '/signIn',
  SIGN_UP: '/signUp',
  HASH_TAG: '/hashTag',
  POPULAR: '/popular',
  FOLLOWING: '/following',
  SEARCH: (searchText = ':searchText') => `/search/${searchText}`,
  DETAIL: (playListId = ':playListId') => `/detail/${playListId}`,
  FOLLOWER: (userId = ':userId') => `/follower/${userId}`,
  PROFILE: (userId = ':userId') => `/profile/${userId}`,
  PROFILE_MODIFY: (userId = ':userId') => `/profile/${userId}/modify`,
  PROFILE_FOLLOWING: (userId = ':userId') => `/profile/${userId}/following`,
  PLAYLIST: (userId = ':userId') => `/playlist/${userId}`,
  PLAYLIST_SAVED: (userId = ':userId') => `/playlist/${userId}/saved`,
  PLAYLIST_LIKES: (userId = ':userId') => `/playlist/${userId}/likes`,
  PLAYLIST_ADD: (userId = ':userId') => `/playlist/${userId}/add`,
  PLAYLIST_MODIFY: (userId = ':userId') => `/playlist/${userId}/modify`,
  NOT_FOUND: '*',
};

export default ROUTES;
