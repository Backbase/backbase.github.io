export function getPermalink(
  title: string,
  specialCategory: boolean,
  category: string,
  date?: string,
): string {
  const base = specialCategory ? category : generateBase(date);
  const titleDirectoryName = toKebabCase(title);
  return `${base}/${titleDirectoryName}`;
}

function generateBase(date?: string): string {
  if (date && !isNaN(Date.parse(date))) {
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0].replace(/-/g, '/');
  }
  return 'unpublished';
}

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
}
