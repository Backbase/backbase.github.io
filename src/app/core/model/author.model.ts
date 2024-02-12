export interface Author {
  avatar: string;
  fullname: string;
  role: string;
  url: string;
}

export interface AuthorsList {
  [fullName: string]: Author;
}
