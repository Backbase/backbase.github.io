export function getPermalink(
  title: string,
  date?: string,
  category?: string
): string {
  const base = generateBase(date, category);
  const titleDirectoryName = toKebabCase(title);
  return `${base}/${titleDirectoryName}`;
}

function generateBase(date?: string, category?: string): string {
  if (date && !isNaN(Date.parse(date))) {
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0].replace(/-/g, '/');
  }
  return category ?? 'unpublished';
}

function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
}
