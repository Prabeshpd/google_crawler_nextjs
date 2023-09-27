'use client';

import * as React from 'react';

import classNames from 'classnames';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { signOut } from 'next-auth/react';

const Header = () => {
  const segment = useSelectedLayoutSegment();
  return (
    <header className="app-header">
      <nav className="app-header__navigation">
        <div className="app-header__menu">
          <Link
            href="/"
            className={classNames('app-header__link', {
              'app-header__link--active': segment === null,
            })}
          >
            Home
          </Link>
          <Link
            href="/upload"
            data-test-id="app-header-upload-keywords-nav"
            className={classNames('app-header__link', {
              'app-header__link--active': segment === 'upload',
            })}
          >
            Upload Keywords
          </Link>
          <Link
            href="/search-results"
            data-test-id="app-header-search-results-nav"
            className={classNames('app-header__link', {
              'app-header__link--active': segment === 'search-results',
            })}
          >
            Search Results
          </Link>
        </div>
        <div className="app-header__dropdown">
          <button
            type="button"
            onClick={() => {
              signOut();
            }}
          >
            Log out
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
