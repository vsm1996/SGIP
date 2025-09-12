'use client';

import React, { useState, useEffect } from 'react';

interface PostShareButtonProps {
  postId: string;
  postUrl: string;
}

const PostShareButton = ({ postId, postUrl }: PostShareButtonProps) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  // Set isBrowser to true once component mounts (client-side only)
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCopyLink = () => {
    if (!isBrowser || !postUrl) return;

    navigator.clipboard.writeText(postUrl);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    if (!isBrowser || !postUrl) return;

    let shareUrl = '';
    const encodedUrl = encodeURIComponent(postUrl);
    const encodedText = encodeURIComponent('Check out this post!');

    switch (platform) {
      case 'bluesky':
        // Using the official Bluesky intent URL format from their documentation
        // https://docs.bsky.app/docs/advanced-guides/intent-links
        shareUrl = `https://bsky.app/intent/compose?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        return;
    }

    // Only create and click anchor element if in browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const anchor = document.createElement('a');
      anchor.href = shareUrl;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.click();
    }

    setShowShareOptions(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="flex items-center gap-1"
        title="Share this post"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hover:text-accent">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Z" />
        </svg>
      </button>

      {showShareOptions && (
        <div className="absolute right-0 bottom-full mb-2 bg-base-300 rounded-lg p-2 shadow-lg z-10 w-40">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 w-full p-2 hover:bg-base-200 rounded text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
            {copied ? 'Copied!' : 'Copy link'}
          </button>

          <button
            onClick={() => handleShare('bluesky')}
            className="flex items-center gap-2 w-full p-2 hover:bg-base-200 rounded text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.625a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM15.375 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zM8.625 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" />
            </svg>
            Bluesky
          </button>

          <button
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2 w-full p-2 hover:bg-base-200 rounded text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
            </svg>
            Facebook
          </button>

          <button
            onClick={() => handleShare('linkedin')}
            className="flex items-center gap-2 w-full p-2 hover:bg-base-200 rounded text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
            </svg>
            LinkedIn
          </button>
        </div>
      )}
    </div>
  );
};

export default PostShareButton;