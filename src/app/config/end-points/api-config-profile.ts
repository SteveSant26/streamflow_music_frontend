export const API_CONFIG_PROFILE = {
  profileMe: {
    get: '/api/user/profile/me/',
  },
  profile: {
    get: '/api/user/profile/',
    getById: (id: string) => `/api/user/profile/${id}/`,
    delete: (id: string) => `/api/user/profile/${id}/`,
  },
  profileUploadPicture: {
    post: '/api/user/profile/upload-profile-picture/',
  },
};
