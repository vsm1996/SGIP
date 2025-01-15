export const timeAgo = (timestamp: string | Date): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const secondsAgo = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
  if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)} days ago`;
  if (secondsAgo < 2628000) return `${Math.floor(secondsAgo / 604800)} weeks ago`;
  if (secondsAgo < 31536000) return `${Math.floor(secondsAgo / 2628000)} months ago`;

  return `${Math.floor(secondsAgo / 31536000)} years ago`;
};
