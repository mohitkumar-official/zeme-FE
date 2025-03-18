import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideBar: React.FC = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) return null;

  return (
    <aside className="sidebar w-64 bg-white shadow-md p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg ${
                location.pathname === '/' ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Properties
            </Link>
          </li>
          <li>
            <Link
              to="/fetch-favourites"
              className={`block px-4 py-2 rounded-lg ${
                location.pathname === '/fetch-favourites' ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Saved Properties
            </Link>
          </li>
          <li>
            <Link
              to="/my-properties"
              className={`block px-4 py-2 rounded-lg ${
                location.pathname === '/my-properties' ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              My Properties
            </Link>
          </li>
          <li>
            <Link
              to="/drafts"
              className={`block px-4 py-2 rounded-lg ${
                location.pathname === '/drafts' ? 'bg-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Draft Properties
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
