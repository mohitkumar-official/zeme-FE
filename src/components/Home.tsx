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


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        user={user}
        onLogout={handleLogout}
        onAddProperty={() => setMultiStepFormOpen(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white shadow-lg z-10">
          <SideBar />
        </aside>

        {/* Main Area */}
        <div className="ml-64 flex-1">
          {/* Search Controls Section */}
          <div className="sticky top-16 z-20 bg-white border-b shadow-sm">
            <div className="px-8 py-4">
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
          <div className="min-h-[calc(100vh-64px-72px)] bg-gray-50">
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
        </div>
      </div>

      <RoleSelectionModal open={isRoleModalOpen} onClose={() => setRoleModalOpen(false)} />
      {isMultiStepFormOpen && <MultiStepPropertyForm onClose={() => setMultiStepFormOpen(false)} />}
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} onApply={() => setIsFilterModalOpen(false)} />
    </div>
  );
};

export default Home;
