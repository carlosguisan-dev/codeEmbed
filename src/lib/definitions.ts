export type Snippet = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  theme: 'light' | 'dark';
  lineNumbers: boolean;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
};

export type User = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
};
