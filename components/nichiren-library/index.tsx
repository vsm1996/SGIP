'use client'

import Link from 'next/link';
import React, { useState } from 'react';

const libraryLinks = [
  {
    label: 'The Writings of Nichiren Daishonin, Vol. 1',
    src: 'https://www.nichirenlibrary.org/en/wnd-1/toc',
  },
  {
    label: 'The Writings of Nichiren Daishonin, Vol. 2',
    src: 'https://www.nichirenlibrary.org/en/wnd-2/toc',
  },
  {
    label: 'The Record of The Orally Transmitted Teachings',
    src: 'https://www.nichirenlibrary.org/en/ott/toc/',
  },
  {
    label: 'The Lotus Sutra',
    src: 'https://www.nichirenlibrary.org/en/lsoc/toc/',
  },
  {
    label: 'The Soka Gakkai - Dictionary of Buddhism',
    src: 'https://www.nichirenlibrary.org/en/dic/toc/',
  },
]

const sidebarContent = libraryLinks.map((link, index) => (
  <li key={link.label} aria-label={link.label}>
    <Link
      href={link.src}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-md p-5 hover:underline text-balance mb-4"
    >
      {link.label}
    </Link>
  </li>
))

const NichirenLibrary = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
    <div className="drawer md:drawer-open">
      <input id="nichiren-library-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center md:py-10">
        {/* Page content here */}
        <label htmlFor="nichiren-library-drawer" className="btn btn-neutral-content drawer-button md:hidden self-start mx-6 my-5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          Library
        </label>
        {children}
      </div>
      <div className="drawer-side overflow-hidden">
        <label htmlFor="nichiren-library-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 px-4 py-24 md:py-8">
          <li>
            <Link
              href="https://www.nichirenlibrary.org/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xl font-semibold p-5 hover:underline text-balance text-accent/90"
            >
              Nichiren Library
            </Link>
          </li>
          <div className="divider w-full" />
          {/* Sidebar content here */}
          {sidebarContent}
        </ul>
      </div>
    </div>
  )

};

export default NichirenLibrary;