import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Building2, FileText } from 'lucide-react';

const SideBar: React.FC = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Base menu items that are always shown
  const baseMenuItems = [
    { path: '/', label: 'All Properties', icon: Home },
    { path: '/fetch-favourites', label: 'Saved Properties', icon: Heart },
  ];

  // Additional menu items shown only when user is logged in
  const authenticatedMenuItems = [
    { path: '/my-properties', label: 'My Properties', icon: Building2 },
    { path: '/drafts', label: 'Draft Properties', icon: FileText },
  ];

  // Combine menu items based on authentication status
  const menuItems = token ? [...baseMenuItems, ...authenticatedMenuItems] : baseMenuItems;

  return (
    <nav className="h-full bg-white border-r">
      <ul className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <li key={item.path} className="py-2">
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SideBar;
