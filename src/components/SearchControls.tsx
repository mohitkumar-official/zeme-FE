import React from 'react';
import { Map, List, Search, SlidersHorizontal } from 'lucide-react';

interface SearchControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: (query: string) => void;
  viewMode: 'map' | 'list';
  onViewModeChange: (mode: 'map' | 'list') => void;
  onFilterClick: () => void;
  sort: string;
  onSortChange: (value: string) => void;
}

const SearchControls: React.FC<SearchControlsProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  viewMode,
  onViewModeChange,
  onFilterClick,
  sort,
  onSortChange,
}) => {
  return (
    <div className="w-full space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
      {/* Search Input */}
      <div className="w-full md:w-1/2 lg:w-1/3">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by address, neighborhood, state, zip"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(searchQuery)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between md:justify-end space-x-2 md:space-x-4">
        {/* View Toggle */}
        <div className="flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => onViewModeChange('map')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Map className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Map</span>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>

        {/* Filter Button */}
        <button 
          className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors" 
          onClick={onFilterClick}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Filters</span>
        </button>

        {/* Sort Dropdown */}
        <select 
          value={sort} 
          onChange={(e) => onSortChange(e.target.value)} 
          className="pl-3 pr-8 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Sort By</option>
          <option value="Newest to Oldest">Newest</option>
          <option value="Oldest to Newest">Oldest</option>
          <option value="Price Low to High">Price: Low to High</option>
          <option value="Price High to Low">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
};

export default SearchControls; 