import { ProcessedAsset } from "./content.model";

export interface Author {
  avatar: string;
  displayAvatar?: ProcessedAsset;
  fullname: string;
  role: string;
  url: string;
}

export interface AuthorsList {
  [fullName: string]: Author;
}
