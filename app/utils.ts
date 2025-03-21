export function timeAgo(date: Date | number | string): string {
  try {
    const timestamp = date instanceof Date ? date.getTime() :
      typeof date === 'number' ? date :
        new Date(date).getTime();

    if (isNaN(timestamp)) {
      return 'Invalid date';
    }

    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';

    if (seconds < 10) return 'just now';

    return Math.floor(seconds) + ' seconds ago';
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
} 