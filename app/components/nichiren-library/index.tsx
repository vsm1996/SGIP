'use client'

import Link from 'next/link';
import React, { useState } from 'react';

const NichirenLibrary = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {

  return (
    <div className="drawer md:drawer-open">
      <input id="nichiren-library-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center py-20 md:py-36">
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
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 px-4 py-36">
          <li>
            <Link
              href="https://www.nichirenlibrary.org/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xl p-5 hover:underline text-balance"
            >
              Nichiren Library
            </Link>
          </li>
          <div className="divider w-full" />
          {/* Sidebar content here */}
          <li>
            <Link
              href="https://www.nichirenlibrary.org/en/wnd-1/toc"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-md p-5 hover:underline text-balance"
            >
              The Writings of Nichiren Daishonin, Vol. 1
            </Link>
          </li>
          <li>
            <Link
              href="https://www.nichirenlibrary.org/en/wnd-2/toc"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-md p-5 hover:underline text-balance"
            >
              The Writings of Nichiren Daishonin, Vol. 2
            </Link>
          </li>
          <li>
            <Link
              href="https://www.nichirenlibrary.org/en/ott/toc/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-md p-5 hover:underline text-balance"
            >
              The Record of The Orally Transmitted Teachings
            </Link>
          </li>
          <li>
            <Link
              href="https://www.nichirenlibrary.org/en/lsoc/toc/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-md p-5 hover:underline text-balance"
            >
              The Lotus Sutra
            </Link>
          </li>
          <li>
            <Link
              href="https://www.nichirenlibrary.org/en/dic/toc/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-md p-5 hover:underline text-balance"
            >
              The Soka Gakkai - Dictionary of Buddhism
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )

};

export default NichirenLibrary;