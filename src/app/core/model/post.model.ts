import { Author } from './author.model';
import { Category } from './categories.model';

export interface Post {
  title: string;
  excerpt: string;
  teaser: string;
  date: string | undefined;
  authors: Array<Author | string>;
  featured?: boolean;
  category: Category;
  tags: string[];
  readingTime: string;
  specialCategory: boolean;
}

export interface Posts {
  posts: Post[];
  total: number;
  perPage: number;
}
