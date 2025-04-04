import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, fetchFavourites, addToFavorites, setFavoriteIds } from '../features/properties/PropertiesSlice';
import { AppDispatch } from '../redux/store';
import PropertiesSplitView from './PropertiesSplitView';

// Define TypeScript interfaces for property, state, and component props
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
  viewMode: 'map' | 'list';  // Either 'map' or 'list' for the view mode
}

// Functional component for the property listing
const PropertiesListing: React.FC<PropertiesListingProps> = ({ viewMode }) => {
  // Destructuring values from Redux store
  const { properties, loading, error, initialLoadDone, favoriteIds } = useSelector(
    (state: RootState) => state.properties
  );

  const dispatch = useDispatch<AppDispatch>();  // Dispatch action to Redux store
  const token = localStorage.getItem('token');  // Retrieve token from local storage

  // useEffect hook for fetching properties and favorites when the component mounts
  useEffect(() => {
    dispatch(fetchProperties({}));  // Fetch properties initially

    // If user is authenticated (i.e., token exists)
    if (token) {
      localStorage.removeItem('favouriteIds');  // Remove any saved favorite IDs from localStorage

      // Fetch user's favorite properties and update Redux store
      dispatch(fetchFavourites())
        .unwrap()
        .then((response: { properties: { propertyIds: string[] }[] }) => {
          if (response?.properties?.length) {
            const ids = response.properties[0]?.propertyIds || [];
            dispatch(setFavoriteIds(ids));  // Set favorite property IDs in Redux store
          } else {
            console.log('No favourites found or response structure is unexpected');
          }
        })
        .catch((err:Error) => {
          console.error('Error fetching favourites:', err);  // Log error if fetching favorites fails
        });
    } else {
      // If the user is not logged in, use localStorage to get favorite IDs
      const savedFavoriteIds = localStorage.getItem('favouriteIds');
      if (savedFavoriteIds) {
        dispatch(setFavoriteIds(savedFavoriteIds.split(',')));  // Set favorite IDs from localStorage
      }
    }
  }, [token]);  // Dependency array ensures the effect runs when `token` changes

  // Handle click on the "favorite" button
  const handleFavoriteClick = (event: React.MouseEvent, propertyId: string) => {
    event.preventDefault();  // Prevent default behavior of the event
    event.stopPropagation();  // Stop event from propagating to parent elements

    const updateFavorites = (updatedIds: string[]) => {
      if (token) {
        // If the user is authenticated, add to favorites in the backend
        dispatch(addToFavorites(propertyId))
          .unwrap()
          .then(() => {
            dispatch(setFavoriteIds(updatedIds));  // Update favorite IDs in Redux store
          })
          .catch((err:Error) => {
            console.error('Error adding to favorites:', err);  // Log error if adding to favorites fails
          });
      } else {
        // If the user is not authenticated, save the favorite IDs in localStorage
        localStorage.setItem('favouriteIds', updatedIds.join(','));
        dispatch(setFavoriteIds(updatedIds));  // Update favorite IDs in Redux store
      }
    };

    // Toggle the property ID in the favorite list
    const updatedIds = favoriteIds.includes(propertyId)
      ? favoriteIds.filter((id) => id !== propertyId)  // Remove from favorites if already present
      : [...favoriteIds, propertyId];  // Add to favorites if not already present

    updateFavorites(updatedIds);  // Update favorites after toggle
  };

  // If properties haven't finished loading yet, show a loading spinner
  if (!initialLoadDone) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If there's an error loading properties, display an error message
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

  // If no properties are available, show a message indicating that
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

  // If properties are available, render them either in map or list view
  return (
    <div className="flex flex-col h-full">
      {viewMode === 'map' ? (
        <PropertiesSplitView />  // If view mode is 'map', render map view component
      ) : (
        // If view mode is 'list', render list of properties
        <div>
          <div className="listings-header">
            <h2>Listings in this area</h2>
            <span className="listings-count">You've got {properties.length} choices</span>
          </div>

          <div className="property-grid">
            {properties.map((property) => (
              <div className="property-card" key={property._id}>
                {/* Property image and favorite button */}
                <div className="property-image relative">
                  <img
                    src={property.images?.[0]?.image_url ? `http://localhost:8000${property.images[0].image_url}` : 'default-image.jpg'}
                    alt={property.basic_information?.address || 'Property Image'}
                    className="w-full h-auto rounded-lg"
                  />
                  {/* Favorite button */}
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

                {/* Property information */}
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
