import { MetaDefinition } from "@angular/platform-browser";
import { PostContent } from "./core/model/post.model";

const prodUrl = 'https://engineering.backbase.com/';
const rootTitle = 'Backbase Engineering';
const rootDescription = 'Backbase is a global fintech company creating the best digital banking solutions on the planet. We are a young-spirited, diverse (45+ nationalities), fast-growing and leading company in our niche.';

export const defaultMeta: MetaDefinition[] = [
  {
    name: 'description',
    content: rootDescription,
  },
  {
    property: 'og:site_name',
    content: rootTitle,
  },
  {
    property: 'og:title',
    content: rootTitle,
  },
  {
    property: 'og:url',
    content: prodUrl,
  },
  {
    property: 'og:description',
    content: rootDescription,
  },
  {
    property: 'og:image',
    content: `${prodUrl}/assets/cover.png`,
  },
];

export const notFoundMeta: MetaDefinition[] = [
  {
    name: 'robots',
    content: 'noindex, nofollow',
  }
]

export const getPostMeta = ({ excerpt, title, displayTeaser }: PostContent, url: string) => [
  {
    name: 'description',
    content: excerpt,
  },
  {
    property: 'og:title',
    content: `${title} | ${rootTitle}`,
  },
  {
    property: 'og:url',
    content: `${prodUrl}${url}`,
  },
  {
    property: 'og:image',
    content: `${prodUrl}${url}/${displayTeaser?.md}`,
  },
  {
    property: 'og:description',
    content: excerpt,
  },
];