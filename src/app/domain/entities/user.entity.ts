export interface User {
  id: string;
  email: string;
  name: string;
  profile_picture?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
