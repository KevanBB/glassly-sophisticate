
export type ViewType = 'timeline' | 'grid';

export type MediaType = 'image' | 'video' | 'audio';
export type PostVisibility = 'free' | 'subscriber' | 'ppv';

export interface Media {
  id: string;
  url: string;
  type: MediaType;
  thumbnail?: string;
  caption?: string;
  file_size: number;
  position: number;
  created_at: string;
}

export interface Post {
  id: string;
  creator_id: string;
  title?: string;
  caption: string;
  media: Media[];
  visibility: PostVisibility;
  price?: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  likes_count?: number;
  comments_count?: number;
}
