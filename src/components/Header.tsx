'use client';

import Link from 'next/link';

const Header = () => {
  const handleDummyClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">100 Letters Project</div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link legacyBehavior href="/" passHref>
                <a
                  data-testid="home-link"
                  onClick={handleDummyClick}
                  className="hover:text-gray-400"
                >
                  Home
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/about" passHref>
                <a
                  data-testid="about-link"
                  onClick={handleDummyClick}
                  className="hover:text-gray-400"
                >
                  About
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="/contact" passHref>
                <a
                  data-testid="contact-link"
                  onClick={handleDummyClick}
                  className="hover:text-gray-400"
                >
                  Contact
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
