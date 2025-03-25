import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  role: string;
  profileImage?: string;
}

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onAddProperty: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onAddProperty }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const token = localStorage.getItem("token");
  const userRole = user?.role ?? null;
  const userImage = user?.profileImage ?? "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <nav className="navbar flex justify-between items-center p-4 shadow-md bg-white">
      <div className="nav-left flex items-center">
        <div className="logo flex items-center">
          <img
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=50&h=50&q=80"
            alt="Logo"
            className="w-10 h-10 rounded-lg"
          />
          <span className="ml-2 font-bold text-lg">zeme</span>
        </div>
      </div>

      <div className="nav-right flex items-center gap-4">
        {token ? (
          <>
            {(userRole === "agent" || userRole === "landlord") && (
              <button
                className="btn btn-add-property px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={onAddProperty}
              >
                Add New Property
              </button>
            )}

            <div className="relative" ref={dropdownRef}>
              <img
                src={userImage}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
                onClick={toggleDropdown}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200">
                  <button
                    className="block w-full text-left px-4 py-2 text-gray-700 bg-white"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="btn btn-login px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
              Log In
            </button>
            <button className="btn btn-register px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => navigate("/register")}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 