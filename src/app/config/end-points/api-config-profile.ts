export const API_CONFIG_PROFILE = {
  profileMe: {
    get: '/api/user/profile/me/',
    post: '/api/user/profile/',
    delete: (id: string) => `/api/user/profile/${id}/`,
    uploadProfilePicture: '/api/user/profile/upload-profile-picture/',
  },
  profile: {
    get: '/api/user/profile/',
    getById: (id: string) => `/api/user/profile/${id}/`,
  },
};
