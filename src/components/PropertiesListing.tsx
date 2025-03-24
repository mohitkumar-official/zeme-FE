import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, fetchFavourites, addToFavorites, setFavoriteIds } from '../features/properties/PropertiesSlice';
import { AppDispatch } from '../redux/store';
import PropertiesSplitView from './PropertiesSplitView';

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
    initialLoadDone: boolean;
  };
}

interface PropertiesListingProps {
  viewMode: 'map' | 'list';
}

const PropertiesListing: React.FC<PropertiesListingProps> = ({ viewMode }) => {
  const { properties, loading, error, initialLoadDone, favoriteIds } = useSelector(
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
    event.stopPropagation();

    const updateFavorites = (updatedIds: string[]) => {
      if (token) {
        dispatch(addToFavorites(propertyId))
          .unwrap()
          .then(() => {
            dispatch(setFavoriteIds(updatedIds));
          })
          .catch((err:Error) => {
            console.error('Error adding to favorites:', err);
          });
      } else {
        localStorage.setItem('favouriteIds', updatedIds.join(','));
        dispatch(setFavoriteIds(updatedIds));
      }
    };

    const updatedIds = favoriteIds.includes(propertyId)
      ? favoriteIds.filter((id) => id !== propertyId)
      : [...favoriteIds, propertyId];

    updateFavorites(updatedIds);
  };

  if (!initialLoadDone) {
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
    <div className="flex flex-col h-full">
      {viewMode === 'map' ? <PropertiesSplitView /> : (
        <div>
          <div className="listings-header">
            <h2>Listings in this area</h2>
            <span className="listings-count">You've got {properties.length} choices</span>
          </div>

          <div className="property-grid">
            {properties.map((property) => (
              <div className="property-card" key={property._id}>
                <div className="property-image relative">
                  <img
                    src={property.images?.[0]?.image_url ? `http://localhost:8000${property.images[0].image_url}` : 'default-image.jpg'}
                    alt={property.basic_information?.address || 'Property Image'}
                    className="w-full h-auto rounded-lg"
                  />
                  <button
                    onClick={(event) => handleFavoriteClick(event, property._id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
                  >
                    {favoriteIds.includes(property._id) ? '❤️' : '🤍'}
                  </button>
                  <span className="tag-no-fee">
                    {property.economic_information?.has_another_fee ? "No fee" : "Fee applies"}
                  </span>
                </div>

                <div className="property-info">
                  <div className="price">${property.economic_information?.gross_rent || 'N/A'}/mo</div>
                  <h3>{property.basic_information?.address || 'Unknown Address'}</h3>
                  <p>
                    {property.basic_information?.unit ? `Unit ${property.basic_information.unit}, ` : ''}
                    {property.basic_information?.floor ? `Floor ${property.basic_information.floor}, ` : ''}
                    {property.basic_information?.square_feet || 'N/A'} sq ft
                  </p>
                  <div className="property-details">
                    <span>{property.basic_information?.bedrooms || 'N/A'} bedrooms</span>
                    <span>{property.basic_information?.bathrooms || 'N/A'} bathrooms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertiesListing;
