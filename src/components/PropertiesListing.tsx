import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, fetchFavourites, addToFavorites, setFavoriteIds } from '../features/properties/PropertiesSlice';
import { AppDispatch } from '../redux/store';

interface Property {
  _id: string;
  images?: { image_url: string }[];
  basic_information?: {
    address: string;
    unit: string;
    floor: string;
    square_feet: number;
    bedrooms: number;
    bathrooms: number;
  };
  economic_information?: {
    gross_rent: number;
    has_another_fee: boolean;
  };
}

interface RootState {
  properties: {
    properties: Property[];
    loading: boolean;
    error: string | null;
    favoriteIds: string[];
  };
}

const PropertiesListing: React.FC = () => {
  const { properties, loading, error, favoriteIds } = useSelector(
    (state: RootState) => state.properties
  );
  
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem('token');

  useEffect(() => {
    dispatch(fetchProperties({}));

    if (token) {
      localStorage.removeItem('favouriteIds');
    
      dispatch(fetchFavourites())
        .unwrap()
        .then((response: { properties: { propertyIds: string[] }[] }) => {
          if (response?.properties?.length) {
            const ids = response.properties[0]?.propertyIds || [];
            dispatch(setFavoriteIds(ids));
          } else {
            console.log('No favourites found or response structure is unexpected');
          }
        })
        .catch((err:Error) => {
          console.error('Error fetching favourites:', err);
        });
    } else {
      const savedFavoriteIds = localStorage.getItem('favouriteIds');
      if (savedFavoriteIds) {
        dispatch(setFavoriteIds(savedFavoriteIds.split(',')));
      }
    }
  }, [token]);

  const handleFavoriteClick = (event: React.MouseEvent, propertyId: string) => {
    event.preventDefault();

    if (token) {
      dispatch(addToFavorites(propertyId))
        .unwrap()
        .then(() => {
          dispatch(
            setFavoriteIds(
              favoriteIds.includes(propertyId)
                ? favoriteIds.filter((id) => id !== propertyId)
                : [...favoriteIds, propertyId]
            )
          );
        })
        .catch((err:Error) => {
          console.error('Error adding to favorites:', err);
        });
    } else {
      const updatedIds = favoriteIds.includes(propertyId)
        ? favoriteIds.filter((id) => id !== propertyId)
        : [...favoriteIds, propertyId];

      localStorage.setItem('favouriteIds', updatedIds.join(','));
      dispatch(setFavoriteIds(updatedIds));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-600 text-center">
          <p className="text-lg font-medium">Error loading properties</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800">No properties available</p>
          <p className="text-sm text-gray-600 mt-2">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Available Properties</h2>
            <p className="text-gray-600 mt-1">{properties.length} properties found</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div 
              key={property._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="relative aspect-[2/1]">
                <img
                  src={property.images?.[0]?.image_url
                    ? `http://localhost:8000${property.images[0].image_url}`
                    : 'default-image.jpg'}
                  alt={property.basic_information?.address || 'Property Image'}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
                  onClick={(event) => handleFavoriteClick(event, property._id)}
                >
                  {favoriteIds.includes(property._id) ? (
                    <span className="text-red-500 text-xl">❤️</span>
                  ) : (
                    <span className="text-gray-400 text-xl">🤍</span>
                  )}
                </button>
                {property.economic_information?.has_another_fee && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                    No Fee
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-2xl font-semibold text-gray-900">
                    ${property.economic_information?.gross_rent || 'N/A'}
                    <span className="text-sm font-normal text-gray-600">/mo</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {property.basic_information?.address || 'Unknown Address'}
                </h3>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <span>{property.basic_information?.bedrooms || 'N/A'} beds</span>
                  <span>{property.basic_information?.bathrooms || 'N/A'} baths</span>
                  <span>{property.basic_information?.square_feet || 'N/A'} sq ft</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {property.basic_information?.unit && (
                    <span>Unit {property.basic_information.unit}</span>
                  )}
                  {property.basic_information?.floor && (
                    <>
                      <span className="mx-1">•</span>
                      <span>Floor {property.basic_information.floor}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
       <div>
      <div className="listings-header">
        <h2>Favorite Listings</h2>
        <span className="listings-count">You've got {properties.length} favorite choices</span>
      </div>

      <div className="property-grid">
        {/* Map through the favoriteProperties array to render each property */}
        {properties.map((property) => (
          <div className="property-card" key={property._id}>
            <div className="property-image">
              {/* Render the property image if it exists, otherwise show a default image */}
              <img
                src={property.images?.[0]?.image_url ? `http://localhost:8000${property.images[0].image_url}` : 'default-image.jpg'}
                alt={property.basic_information?.address || 'Property Image'}
              />
              {/* Button to toggle the favorite status */}
              <button
                className="btn-favorite"
                onClick={(event) => handleFavoriteClick(event, property._id)}
              >
                {/* Display heart icon based on whether the property is in the favorites list */}
                {favoriteIds.includes(property._id) ? '❤️' : '🤍'}
              </button>
              {/* Display whether the property has an additional fee */}
              <span className="tag-no-fee">
                {property.economic_information?.has_another_fee ? "No fee" : "Fee applies"}
              </span>
            </div>
            <div className="property-info">
              <div className="price">${property.economic_information?.gross_rent || 'N/A'}/mo</div>
              <h3>{property.basic_information?.address || 'Unknown Address'}</h3>
              <p>
                {/* Display unit, floor, and square footage if available */}
                {property.basic_information?.unit ? `Unit ${property.basic_information.unit}, ` : ''}
                {property.basic_information?.floor ? `Floor ${property.basic_information.floor}, ` : ''}
                {property.basic_information?.square_feet || 'N/A'} sq ft
              </p>
              <div className="property-details">
                {/* Display number of bedrooms and bathrooms if available */}
                <span>{property.basic_information?.bedrooms || 'N/A'} bedrooms</span>
                <span>{property.basic_information?.bathrooms || 'N/A'} bathrooms</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default PropertiesListing;
