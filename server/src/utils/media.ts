export const resolveImageUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const base = process.env.PUBLIC_BASE_URL || "";
  return `${base}${path}`;
};
