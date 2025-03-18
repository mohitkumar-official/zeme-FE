import React from 'react';
import { FormData } from '../types/property';
import { X, Eye, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface PropertyPreviewModalProps {
  property: FormData;
  onPublish: (publish: boolean) => void;
}

const PropertyPreviewModal: React.FC<PropertyPreviewModalProps> = ({ property, onPublish }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative bg-white rounded-lg w-[95%] max-w-7xl max-h-[95vh] overflow-y-auto my-4 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-[9999]">
          <div>
            <h2 className="text-2xl font-semibold">{property.basic_information.address}</h2>
            <p className="text-gray-600">
              {property.basic_information.unit ? `Unit ${property.basic_information.unit}, ` : ''}
              {property.basic_information.floor ? `Floor ${property.basic_information.floor}` : ''}
            </p>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Main Image and Gallery */}
          <div className="grid grid-cols-12 gap-4">
            {/* Main large image */}
            <div className="col-span-12 md:col-span-8 aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
              {property.images?.length > 0 ? (
                <img
                  src={`http://localhost:8000${property.images[0].image_url}`}
                  alt="Main Property View"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <img
                  src="/images/placeholder.png" // Replace with a real placeholder image
                  alt="No Image Available"
                  className="w-full h-full object-cover opacity-50"
                />
              )}
            </div>

            {/* Side gallery */}
            <div className="col-span-12 md:col-span-4 grid grid-rows-4 gap-4">
              {property.images?.length > 1 ? (
                property.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                    <img
                      src={`http://localhost:8000${image.image_url}`}
                      alt={`Property ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))
              ) : (
                <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-md flex items-center justify-center bg-gray-200">
                  <p className="text-gray-500">No Additional Images</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Bedrooms', value: property.basic_information.bedrooms },
            { label: 'Bathrooms', value: property.basic_information.bathrooms },
            { label: 'Square Feet', value: property.basic_information.sqauare_feet || 'N/A' },
          ].map((item, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <p className="text-gray-600 text-sm">{item.label}</p>
              <p className="text-xl font-semibold mt-1">{item.value}</p>
            </div>
          ))}
          <div className="text-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <p className="text-gray-600 text-sm">Views</p>
            <div className="flex items-center justify-center mt-1">
              <Eye className="w-5 h-5 text-gray-400 mr-1" />
              <span className="text-xl font-semibold">0</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-4">Property Description</h3>
          <p className="text-gray-600 leading-relaxed">
            Welcome to your future home! This charming property offers {property.basic_information.bedrooms} bedrooms,{' '}
            {property.basic_information.bathrooms} bathrooms, and a cozy balcony. Experience convenience with a dishwasher
            included. Don't miss out on this gem! Feel free to apply directly or message me with any questions.
          </p>
        </div>

        {/* Documents Required */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Documents Required</h3>
          {property.upload_document?.required_documents?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {property.upload_document.required_documents.map((doc, index) => (
                <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-900 capitalize">{doc.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No documents required</p>
          )}
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Amenities</h3>
          {property.amenities?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-gray-800 capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No amenities available</p>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-between items-center z-[9999] shadow-lg">
          <div>
            <p className="text-sm text-gray-600">Available from</p>
            <p className="font-medium">
              {property.basic_information.date_available
                ? new Date(property.basic_information.date_available).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          <div className="flex space-x-4">
            <button type="button" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={() => onPublish(true)}
              type="button"
              className="px-6 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save As Draft
            </button>
            <button
              onClick={() => onPublish(false)}
              type="button"
              className="px-6 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
            >
              Publish Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPreviewModal;
