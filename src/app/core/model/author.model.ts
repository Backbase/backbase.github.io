export interface Author {
  avatar: string;
  fullname: string;
  role: string;
}

export interface AuthorsList {
  [fullName: string]: Author;
}
