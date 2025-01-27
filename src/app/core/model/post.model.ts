import { Author } from './author.model';
import { Category } from './categories.model';
import { ProcessedAsset } from './content.model';
import { Location } from './locations.model';

export interface Post {
  title: string;
  excerpt: string;
  teaser: string;
  displayTeaser?: ProcessedAsset;
  date: string | undefined;
  authors: Array<Author | string>;
  featured?: boolean;
  category: Category;
  location?: Location;
  tags: string[];
  readingTime: string;
  specialCategory: boolean;
}

export type PostContent = Post & {
  markdown: string;
}

export interface Posts {
  posts: Post[];
  total: number;
  perPage: number;
}
