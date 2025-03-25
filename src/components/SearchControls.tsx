import React from 'react';
import { Map, List } from 'lucide-react';

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
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search Input */}
        <div className="w-full md:w-1/3">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by address, neighborhood, state, zip"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch(searchQuery)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {/* View Toggle */}
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => onViewModeChange('map')}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                viewMode === 'map'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Map className="w-5 h-5 mr-2" />
              Map
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5 mr-2" />
              List
            </button>
          </div>

          {/* Filter Button */}
          <button 
            className="px-4 py-2 text-sm text-white bg-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-700 transition-colors" 
            onClick={onFilterClick}
          >
            Filters
          </button>

          {/* Sort Dropdown */}
          <select 
            value={sort} 
            onChange={(e) => onSortChange(e.target.value)} 
            className="px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort By</option>
            <option value="Newest to Oldest">Newest to Oldest</option>
            <option value="Oldest to Newest">Oldest to Newest</option>
            <option value="Price Low to High">Price Low to High</option>
            <option value="Price High to Low">Price High to Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchControls; 