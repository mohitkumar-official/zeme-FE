import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleSelectionModal from './RoleSelectionModal';

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
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const token = localStorage.getItem("token");
  const userRole = user?.role ?? null;
  const userImage = user?.profileImage ?? "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";


  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
      <div className="h-full px-4 md:px-8 mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=50&h=50&q=80"
            alt="Logo"
            className="w-8 h-8 md:w-10 md:h-10 rounded-lg"
          />
          <span className="ml-2 font-bold text-lg text-gray-900">zeme</span>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {token ? (
            <> 
              {(userRole === "agent" || userRole === "landlord") && (
                <button
                  className="hidden md:block px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={onAddProperty}
                >
                  Add Property
                </button>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={userImage}
                    alt="User"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-gray-200"
                  />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                    {/* {(userRole === "agent" || userRole === "landlord") && (
                      <button
                        className="md:hidden w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => {
                          onAddProperty();
                          setIsDropdownOpen(false);
                        }}
                      >
                        Add Property
                      </button>
                    )} */}
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        onLogout();
                        setIsDropdownOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate("/login")} 
                className="px-3 py-1.5 md:px-4 md:py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Log In
              </button>
              <button 
                 onClick={() => setIsModalOpen(true)}  // Open the modal when Register button is clicked
                className="px-3 py-1.5 md:px-4 md:py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register
              </button>
              <RoleSelectionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </>

          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 