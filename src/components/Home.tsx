import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import SideBar from "./SideBar";
import RoleSelectionModal from "./RoleSelectionModal";
import MultiStepPropertyForm from "./MultiStepForm";
import { FilterModal } from "./FilterModal";
import { fetchProperties, setFilterss } from "../features/properties/PropertiesSlice";
import { AppDispatch } from "../redux/store";
import Navbar from "./Navbar";
import SearchControls from "./SearchControls";
import MainContent from "./MainContent";
import { Menu } from 'lucide-react';

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
  const user: User | null = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
  const dispatch = useDispatch<AppDispatch>();

  const [isRoleModalOpen, setRoleModalOpen] = useState(false);
  const [isMultiStepFormOpen, setMultiStepFormOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    : { filters: {} };

    setLoading(true);
    dispatch(fetchProperties(filterRequestBody))
      .unwrap()
      .finally(() => setLoading(false));

    dispatch(setFilterss(filterRequestBody));
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = event.target.value;
    setSort(selectedFilter);

    const filterRequestBody: FilterRequestBody = { filters: { sort: selectedFilter } };

    dispatch(fetchProperties(filterRequestBody));
    dispatch(setFilterss(filterRequestBody));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const toggleSidebar = () => {  //toggle sidebar
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const menuButton = document.getElementById('mobile-menu-button');
      
      if (sidebar && menuButton && 
          !sidebar.contains(event.target as Node) && 
          !menuButton.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        onLogout={handleLogout}
        onAddProperty={() => setMultiStepFormOpen(true)}
      />

      <div className="flex h-[calc(100vh-4rem)] pt-16">
        {/* Mobile Menu Button only visible on mobile */}
        <button 
          id="mobile-menu-button"
          onClick={toggleSidebar}
          className="md:hidden fixed top-[4.5rem] left-4 z-50 p-2 rounded-md bg-white shadow-md hover:bg-gray-50"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* Sidebar */}
        <div 
          id="mobile-sidebar"
          className={`fixed md:static top-16 left-0 h-[calc(100vh-4rem)] w-64 transform transition-transform duration-300 ease-in-out z-40 
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <SideBar />
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Area */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {/* Search Controls Section */}
          <div className="sticky top-16 z-20 bg-white border-b shadow-sm">
            <div className="p-4 md:px-6">
              <SearchControls 
                searchQuery={searchQuery} 
                onSearchChange={setSearchQuery} 
                onSearch={handleSearch} 
                viewMode={viewMode} 
                onViewModeChange={setViewMode}
                onFilterClick={() => setIsFilterModalOpen(true)}
                sort={sort}
                onSortChange={(value: string) => handleFilterChange({ target: { value } } as React.ChangeEvent<HTMLSelectElement>)}
              />
            </div>
          </div>

          {/* Main Content Section */}
          <div className="bg-gray-50">
            <MainContent
              viewMode={viewMode}
              isRoleModalOpen={isRoleModalOpen}
              isMultiStepFormOpen={isMultiStepFormOpen}
              isFilterModalOpen={isFilterModalOpen}
              onRoleModalClose={() => setRoleModalOpen(false)}
              onMultiStepFormClose={() => setMultiStepFormOpen(false)}
              onFilterModalClose={() => setIsFilterModalOpen(false)}
            />
          </div>
        </main>
      </div>

      <RoleSelectionModal open={isRoleModalOpen} onClose={() => setRoleModalOpen(false)} />
      {isMultiStepFormOpen && <MultiStepPropertyForm onClose={() => setMultiStepFormOpen(false)} />}
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={() => setIsFilterModalOpen(false)} />
    </div>
  );
};

export default Home;
