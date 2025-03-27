'use client';

import Link from 'next/link';

const Header = () => {
  const handleDummyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <header className="bg-gray-800 text-white p-4 font-merriweather">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl">100 Letters Project</div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <button
                data-testid="home-link"
                onClick={handleDummyClick}
                className="hover:text-gray-400"
              >
                Home
              </button>
            </li>
            <li>
              <button
                data-testid="about-link"
                onClick={handleDummyClick}
                className="hover:text-gray-400"
              >
                About
              </button>
            </li>
            <li>
              <button
                data-testid="contact-link"
                onClick={handleDummyClick}
                className="hover:text-gray-400"
              >
                Contact
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
