export function getPermalink(title: string, date?: string, category?: string): string {
  let base;
  if (!date) {
    base = category;
  } else {
    const parsedDate = new Date(date);
    base = Number.isNaN(parsedDate.getTime()) ?
      'unpublished' :
      `${parsedDate.getFullYear()}/${(parsedDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${parsedDate.getDate().toString().padStart(2, '0')}`;
  }

  const titleDirectoryName = title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');

  return `${base}/${titleDirectoryName}`;
}
