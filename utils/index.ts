export const timeAgo = (timestamp: string | Date): string => {
  const units = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2628000 },
    { name: 'week', seconds: 604800 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
    { name: 'second', seconds: 1 },
  ];

  const secondsAgo = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
  const unit = units.find(u => secondsAgo >= u.seconds) || units[units.length - 1];

  const value = Math.floor(secondsAgo / unit.seconds);
  return `${value} ${unit.name}${value === 1 ? '' : 's'} ago`;
};