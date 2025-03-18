import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import SideBar from "./SideBar";
import PropertiesListing from "./PropertiesListing";
import PropertiesState from "../context/properties/PropertiesState";
import SavedPropertiesListing from "./SavedPropertiesListing";
import RoleSelectionModal from "./RoleSelectionModal";
import MyProperties from "./MyProperties";
import DraftProperties from "./DraftProperties";
import MultiStepPropertyForm from "./MultiStepForm";
import { FilterModal } from "./FilterModal";
import { fetchProperties, setFilterss } from "../features/properties/PropertiesSlice";
import { AppDispatch } from "../redux/store";

interface User {
  role: string;
  profileImage?: string;
}

interface FilterRequestBody {
  filters?: {
    keyword?: string;
    sort?: string;
  };
}

const Home: React.FC = () => {
  const token = localStorage.getItem("token");
  const user: User | null = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
  const userRole = user?.role ?? null;
  const userImage = user?.profileImage ?? "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [isRoleModalOpen, setRoleModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMultiStepFormOpen, setMultiStepFormOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchQuery.trim());
    }, 500);

    return () => clearTimeout(delayDebounce);
     // eslint-disable-next-line
  }, [searchQuery]);

  const handleSearch = (searchTerm: string = "") => {
    const filterRequestBody: FilterRequestBody = searchTerm
    ? { filters: { keyword: searchTerm } }
    : { filters: {} }; // Always return an object with a filters property


    setLoading(true);
    dispatch(fetchProperties(filterRequestBody))
      .unwrap()
      .finally(() => setLoading(false));

    dispatch(setFilterss(filterRequestBody));
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value;
    setSort(selectedFilter);

    const filterRequestBody: FilterRequestBody = { filters: { sort: selectedFilter } }; // ✅ Always an object

    dispatch(fetchProperties(filterRequestBody));
    dispatch(setFilterss(filterRequestBody));
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);


  return (
    <div className="app-container min-h-screen">
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
                  onClick={() => setMultiStepFormOpen(true)}
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
                      onClick={handleLogout}
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
              <button className="btn btn-register px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => setRoleModalOpen(true)}>
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      <SideBar />
      <main className="main-content p-5 bg-gray-100">
        <div className="search-bar flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-full"
              placeholder="Search by address, neighborhood, state, zip"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            />
          </div>
          <div className="search-controls flex items-center gap-4">
            <button 
              className="px-4 py-2 text-sm text-white border-2 border-blue-600 rounded-full" 
              onClick={() => setIsFilterModalOpen(true)}
            >
              Filters
            </button>
            <select 
              value={sort} 
              onChange={handleFilterChange} 
              className="px-4 py-2 text-sm border rounded-lg"
            >
              <option value="Newest to Oldest">Newest to Oldest</option>
              <option value="Oldest to Newest">Oldest to Newest</option>
              <option value="Price Low to High">Price Low to High</option>
              <option value="Price High to Low">Price High to Low</option>
            </select>
          </div>
        </div>

        <PropertiesState>
          <Routes>
            <Route path="/" element={<PropertiesListing />} />
            <Route path="/fetch-favourites" element={<SavedPropertiesListing />} />
            <Route path="/my-properties" element={<MyProperties />} />
            <Route path="/drafts" element={<DraftProperties />} />
          </Routes>
        </PropertiesState>
      </main>

      <RoleSelectionModal open={isRoleModalOpen} onClose={() => setRoleModalOpen(false)} />
      {isMultiStepFormOpen && <MultiStepPropertyForm onClose={() => setMultiStepFormOpen(false)} />}
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={() => setIsFilterModalOpen(false)} />
    </div>
  );
};

export default Home;
