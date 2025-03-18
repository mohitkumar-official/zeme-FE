import React from 'react';
import { AMENITY_OPTIONS } from './constants';
import { FormData } from '../../../types/property';

// Define the types for the props
interface AmenitiesSelectionProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

interface Amenity {
  id: string;
  label: string;
  icon: string;
}

export function AmenitiesSelection({ formData, setFormData }: AmenitiesSelectionProps) {
  // Function to toggle the selection of an amenity
  const toggleAmenity = (amenityId: string) => {
    setFormData((prev:FormData) => {
      // Check if the amenity is already selected
      const newAmenities = prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id: string) => id !== amenityId) // Remove it if already selected
        : [...prev.amenities, amenityId]; // Add it if not selected

      return { ...prev, amenities: newAmenities }; // Return the updated formData
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Select all the amenities that the property has
      </h2>

      {/* Grid of amenities options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Map through all amenities options */}
        {AMENITY_OPTIONS.map((amenity: Amenity) => {
          // Check if this amenity is selected
          const isSelected = formData.amenities.includes(amenity.id);

          return (
            <button
              key={amenity.id} // Key for each amenity
              onClick={() => toggleAmenity(amenity.id)} // Toggle the selection of the amenity
              className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-100 shadow-md' // Styling for selected state
                    : 'border-gray-300 bg-white hover:bg-gray-100' // Styling for default state
                }`}
            >
              <span className="text-2xl">{amenity.icon}</span>
              <span
                className={`font-medium transition-colors duration-300 ${
                  isSelected ? 'text-blue-600' : 'text-gray-800'
                }`}
              >
                {amenity.label} {/* Display the label of the amenity */}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}