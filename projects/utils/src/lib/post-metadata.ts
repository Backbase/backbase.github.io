import { readingTime } from 'reading-time-estimator';

export function extractPostMetaData(post: string, metaonly: boolean = false) {
  const [header, markdown] = post.split(/---(.*)/s);
  return {
    title: header.match(/^# ([^\n]+)/m)?.[1] || '',
    excerpt: header.match(/^#[^\n]+\n+([^\n]+)/s)?.[1] || '',
    teaser: header.match(/^\!\[[^\(]+\(([^\)]+)/im)?.[1] || '',
    authors: header
      .match(/^Authors: ([^\n]+)/im)?.[1]
      ?.split(',')
      .map(n => n.trim()) || [],
    category: header.match(/^Category: ([^\n]+)/im)?.[1] || '',
    location: header.match(/^Location: ([^\n]+)/im)?.[1] || '',
    tags: header
      .match(/^Tags: ([^\n]+)/im)?.[1]
      ?.split(',')
      .map(n => n.trim()) || [],
    date: header.match(/^Date: ([^\n]+)/im)?.[1] || '',
    readingTime: readingTime(post, 238).text,
    ...(metaonly ? {} : { markdown })
  }
}