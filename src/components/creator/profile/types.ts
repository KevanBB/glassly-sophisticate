
export type ViewType = 'timeline' | 'grid';

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  caption?: string;
  created_at: string;
}

export interface Post {
  id: string;
  creator_id: string;
  caption: string;
  media: Media[];
  created_at: string;
  likes_count: number;
  comments_count: number;
}
