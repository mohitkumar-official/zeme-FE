import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { AMENITY_OPTIONS } from './forms/steps/constants';
import { fetchProperties, setFilterss } from '../features/properties/PropertiesSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';

// Types for the filter state and amenity
interface FilterState {
  keyword: string;
  easyApply: boolean;
  noFee: boolean;
  bedrooms: string[];
  bathrooms: string[];
  minRent: number;
  maxRent: number;
  amenities: string[];
  minSquareFootage: number;
  maxSquareFootage: number;
}

// Custom Checkbox Component
interface CustomCheckboxProps {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label: string;
  className?: string;
  icon?:string
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, label, className = '' }) => {
  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only" // Hide the actual input
        />
        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
          checked 
            ? 'bg-blue-500 border-blue-500' 
            : 'border-gray-300 bg-white'
        }`}>
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      <span className="text-gray-700">{label}</span>
    </label>
  );
};

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filterRequestBody: any) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    easyApply: false,
    noFee: false,
    bedrooms: [],
    bathrooms: [],
    minRent: 0,
    maxRent: 10000,
    amenities: [],
    minSquareFootage: 0,
    maxSquareFootage: 5000,
  });

  const bedroomOptions = ['1', '2', '3', '4', '5+'];
  const bathroomOptions = ['1', '1.5', '2', '2.5', '3', '3.5+'];

  // const dispatch = useDispatch();
  const dispatch = useDispatch<AppDispatch>();

  const toggleBedroom = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      bedrooms: prev.bedrooms.includes(value)
        ? prev.bedrooms.filter((b) => b !== value)
        : [...prev.bedrooms, value],
    }));
  };

  const toggleBathroom = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      bathrooms: prev.bathrooms.includes(value)
        ? prev.bathrooms.filter((b) => b !== value)
        : [...prev.bathrooms, value],
    }));
  };

  const toggleAmenity = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(value)
        ? prev.amenities.filter((a) => a !== value)
        : [...prev.amenities, value],
    }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      easyApply: false,
      noFee: false,
      bedrooms: [],
      bathrooms: [],
      minRent: 0,
      maxRent: 10000,
      amenities: [],
      minSquareFootage: 0,
      maxSquareFootage: 5000,
    });
  };

  if (!isOpen) return null;

  const handleApply = () => {
    const filterRequestBody: any = {
      filters: {},
    };
  
    // Add only the filters that have values
    if (filters.keyword) filterRequestBody.filters.keyword = filters.keyword;
    if (filters.easyApply) filterRequestBody.filters.easyApply = filters.easyApply;
    if (filters.noFee) filterRequestBody.filters.noFee = filters.noFee;
    if (filters.bedrooms.length > 0) filterRequestBody.filters.bedrooms = filters.bedrooms;
    if (filters.bathrooms.length > 0) filterRequestBody.filters.bathrooms = filters.bathrooms;
    if (filters.minRent > 0) filterRequestBody.filters.minRent = filters.minRent;
    if (filters.maxRent < 10000) filterRequestBody.filters.maxRent = filters.maxRent;
    if (filters.amenities.length > 0) filterRequestBody.filters.amenities = filters.amenities;
    if (filters.minSquareFootage > 0) filterRequestBody.filters.minSquareFootage = filters.minSquareFootage;
    if (filters.maxSquareFootage < 5000) filterRequestBody.filters.maxSquareFootage = filters.maxSquareFootage;
  
    dispatch(fetchProperties(filterRequestBody));  // Pass the filterRequestBody here
    dispatch(setFilterss(filterRequestBody));  // Make sure to dispatch the filter setting as well
  
    onClose();  // Close the modal after applying filters
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 z-10 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Filter by</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset Filters
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Search by keyword */}
          <div>
            <input
              type="text"
              placeholder="Search by keyword"
              value={filters.keyword}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, keyword: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Quick filters */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Filters</h3>
            <div className="space-y-3">
              <CustomCheckbox
                checked={filters.easyApply}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, easyApply: e.target.checked }))
                }
                label="Easy Apply Properties"
              />
              <CustomCheckbox
                checked={filters.noFee}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, noFee: e.target.checked }))
                }
                label="No Fee"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Bedrooms</h3>
            <div className="flex flex-wrap gap-2">
              {bedroomOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleBedroom(option)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.bedrooms.includes(option)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Bathrooms</h3>
            <div className="flex flex-wrap gap-2">
              {bathroomOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleBathroom(option)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.bathrooms.includes(option)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Rent Range */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Monthly Rent Range</h3>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={filters.minRent}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minRent: Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min"
                />
              </div>
              <span className="text-gray-400">to</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={filters.maxRent}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxRent: Math.max(prev.minRent, Number(e.target.value)),
                    }))
                  }
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AMENITY_OPTIONS.map((amenity) => (
                <CustomCheckbox
                  key={amenity.id}
                  checked={filters.amenities.includes(amenity.id)}
                  onChange={() => toggleAmenity(amenity.id)}
                  label={amenity.label}
                  icon={amenity.icon}
                />
              ))}
            </div>
          </div>

          {/* Square Footage */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Square Footage</h3>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={filters.minSquareFootage}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minSquareFootage: Math.max(0, Number(e.target.value)),
                  }))
                }
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min sq ft"
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                value={filters.maxSquareFootage}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxSquareFootage: Math.max(prev.minSquareFootage, Number(e.target.value)),
                  }))
                }
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max sq ft"
              />
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={handleApply}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
