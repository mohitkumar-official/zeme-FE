import React, { useEffect, useState } from 'react';
import { Calendar, HelpCircle, MapPin } from 'lucide-react'; // Importing icons from lucide-react
import { BEDROOM_OPTIONS, BATHROOM_OPTIONS } from './constants'; // Importing bedroom and bathroom options
import { toast } from 'react-toastify';  // Changed from react-hot-toast to react-toastify

interface AddressSuggestion {
  place_name: string;
  center: [number, number];
  text: string;
  context?: Array<{
    text: string;
    id: string;
  }>;
}

// Define the types for the props
interface BasicInformationProps {
  formData: {
    basic_information: {
      address: string | null;
      unit: string | null;
      floor: string | null;
      bedrooms: string | null;
      bathrooms: string | null;
      sqauare_feet: string | null;
      date_available: string | null;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    listingType: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>; // Function to update formData
  errors: {
    address?: string;
    unit?: string;
    bedrooms?: string;
    bathrooms?: string;
    date_available?: string;
  }; // Errors for validation
}

export function BasicInformation({ formData, setFormData, errors }: BasicInformationProps) {
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to get safe string value
  const getSafeValue = (value: string | null): string => value || '';

  // Function to fetch address suggestions using Mapbox
  const fetchAddressSuggestions = async (query: string) => {
    if (!query.trim()) {
      setAddressSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}&country=in&types=address,place,locality,neighborhood&limit=5`
      );
      const data = await response.json();
      if (data.features) {
        setAddressSuggestions(data.features);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      toast.error('Failed to fetch address suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle input change events for fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data for all fields including address
    setFormData((prev:BasicInformationProps['formData']) => ({
      ...prev,
      basic_information: {
        ...prev.basic_information,
        [name]: value,
      },
    }));

    // Additional handling for address field
    if (name === 'address') {
      setShowSuggestions(true);
      // Debounce the API call
      const timeoutId = setTimeout(() => {
        console.log('Fetching suggestions for:', value);
        fetchAddressSuggestions(value);
      }, 300);

      // Cleanup timeout on next change
      return () => clearTimeout(timeoutId);
    }
  };

  // Function to handle address selection
  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    const [lng, lat] = suggestion.center;
    
    if (isNaN(lat) || isNaN(lng)) {
      console.error('Invalid coordinates received:', { lat, lng });
      toast.error('Invalid coordinates received from Mapbox');
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.error('Coordinates out of valid range:', { lat, lng });
      toast.error('Invalid coordinate values received');
      return;
    }

    setFormData((prev: BasicInformationProps['formData']) => {
      const newFormData = {
        ...prev,
        basic_information: {
          ...prev.basic_information,
          address: suggestion.place_name,
          coordinates: {
            lat,
            lng
          }
        }
      };
      console.log('Updated form data with coordinates:', newFormData.basic_information.coordinates);
      return newFormData;
    });
    
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Enter some basic information.</h2>

      <div className="space-y-4">
        {/* Listing Type Radio Buttons */}
        <div>
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            LISTING TYPE <HelpCircle className="h-4 w-4 text-gray-400" /> {/* Help icon for listing type */}
          </label>
          <div className="mt-2 flex space-x-4">
            {/* Exclusive Listing Option */}
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="listingType"
                value="exclusive"
                checked={formData.listingType === 'exclusive'} // Check if 'exclusive' is selected
                onChange={handleInputChange}
                className="text-blue-500"
              />
              <span>Exclusive</span>
            </label>
            {/* Open Listing Option */}
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="listingType"
                value="open"
                checked={formData.listingType === 'open'} // Check if 'open' is selected
                onChange={handleInputChange}
                className="text-blue-500"
              />
              <span>Open</span>
            </label>
          </div>
        </div>

        {/* Address Field with Geocoding Indicator */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ADDRESS<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="address"
              value={getSafeValue(formData.basic_information.address)}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 pl-10"
              placeholder="Enter an address"
              required
              onClick={(e) => {
                e.stopPropagation();
                setShowSuggestions(true);
              }}
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            
            {/* Address Suggestions Dropdown */}
            {showSuggestions && (addressSuggestions.length > 0 || isLoading) && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : (
                  addressSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddressSelect(suggestion);
                      }}
                    >
                      {suggestion.place_name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        {/* Unit and Floor Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              UNIT<span className="text-red-500">*</span> {/* Required field */}
            </label>
            <input
              type="text"
              name="unit"
              value={getSafeValue(formData.basic_information.unit)}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Unit"
              required
            />
            {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              FLOOR
            </label>
            <input
              type="text"
              name="floor"
              value={getSafeValue(formData.basic_information.floor)}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Floor"
            />
          </div>
        </div>

        {/* Bedroom Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            BEDROOMS<span className="text-red-500">*</span> {/* Required field */}
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {BEDROOM_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setFormData((prev: BasicInformationProps['formData']) => ({
                  ...prev,
                  basic_information: {
                    ...prev.basic_information,
                    bedrooms: option, // Update the selected bedroom option
                  },
                }))}
                className={`px-4 py-2 rounded-lg ${
                  formData.basic_information.bedrooms === option
                    ? 'bg-blue-500 text-white' // Selected state style
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Default state style
                }`}
              >
                {option}
              </button>
            ))}
            {/* Text input if custom value is entered */}
            <input
              type="text"
              placeholder="Enter #"
              className="px-4 py-2 rounded-lg border"
              value={!BEDROOM_OPTIONS.includes(getSafeValue(formData.basic_information.bedrooms)) ? getSafeValue(formData.basic_information.bedrooms) : ''}
              onChange={(e) => setFormData((prev: BasicInformationProps['formData']) => ({
                ...prev,
                basic_information: {
                  ...prev.basic_information,
                  bedrooms: e.target.value
                },
              }))}
            />
            {errors.bedrooms && <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>}
          </div>
        </div>

        {/* Bathroom Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            BATHROOMS<span className="text-red-500">*</span> {/* Required field */}
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {BATHROOM_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setFormData((prev: BasicInformationProps['formData']) => ({
                  ...prev,
                  basic_information: {
                    ...prev.basic_information,
                    bathrooms: option, // Update selected bathroom option
                  },
                }))}
                className={`px-4 py-2 rounded-lg ${
                  formData.basic_information.bathrooms === option
                    ? 'bg-blue-500 text-white' // Selected state style
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Default state style
                }`}
              >
                {option}
              </button>
            ))}
            <input
              type="text"
              placeholder="Enter #"
              className="px-4 py-2 rounded-lg border"
              value={!BATHROOM_OPTIONS.includes(getSafeValue(formData.basic_information.bathrooms)) ? getSafeValue(formData.basic_information.bathrooms) : ''}
              onChange={(e) => setFormData((prev: BasicInformationProps['formData']) => ({
                ...prev,
                basic_information: {
                  ...prev.basic_information,
                  bathrooms: e.target.value
                },
              }))}
            />
            {errors.bathrooms && <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>}
          </div>
        </div>

        {/* Square Footage and Date Available Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SQUARE FOOTAGE (SQ FT)
            </label>
            <input
              type="number"
              name="sqauare_feet"
              value={getSafeValue(formData.basic_information.sqauare_feet)}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Square Footage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              DATE AVAILABLE<span className="text-red-500">*</span> {/* Required field */}
            </label>
            <div className="relative">
              <input
                type="date"
                name="date_available"
                // value={getSafeValue(formData.basic_information.date_available)}
                value={formData.basic_information.date_available 
                  ? new Date(formData.basic_information.date_available).toISOString().split("T")[0] 
                  : ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                required
              />
              {/* Calendar icon */}
              {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" /> */}
              {errors.date_available && <p className="text-red-500 text-sm mt-1">{errors.date_available}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
