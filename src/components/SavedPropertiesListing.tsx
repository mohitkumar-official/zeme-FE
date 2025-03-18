import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, fetchFavourites, addToFavorites, setFavoriteIds } from '../features/properties/PropertiesSlice';
import { AppDispatch } from '../redux/store';

// Define the structure of a Property
interface Property {
  _id: string;
  images?: { image_url: string }[]; // Optional array for property images
  basic_information?: {
    address: string;
    unit?: string;
    floor?: string;
    square_feet?: string;
    bedrooms?: number;
    bathrooms?: number;
  };
  economic_information?: {
    gross_rent?: number;
    another_fee?: boolean;
  };
}

// The main component for displaying saved properties
const SavedPropertiesListing: React.FC = () => {
  // Retrieve the token from localStorage to check if the user is logged in
  const token = localStorage.getItem('token');
  
  // Use Redux to get properties, loading state, error state, and favoriteIds
  const { properties, loading, error, favoriteIds } = useSelector(
    (state: { properties: { properties: Property[]; loading: boolean; error: string; favoriteIds: string[] } }) => state.properties
  );

  // Dispatch function to send actions to Redux store
  // const dispatch = useDispatch();
    const dispatch = useDispatch<AppDispatch>();

  // UseEffect to fetch properties and favorite IDs when the component mounts
  useEffect(() => {
    // Fetch the properties when the component loads
    dispatch(fetchProperties({}));
    
    // If the user is logged in, fetch their favorite properties
    if (token) {
      localStorage.removeItem('favouriteIds'); // Clear any stored favoriteIds from localStorage
      dispatch(fetchFavourites()) // Dispatch the fetchFavourites action
        .unwrap() // Unwrap the result to get the response directly
        .then((response: { properties: { propertyIds: string[] }[] }) => {
          if (response && response.properties && response.properties.length > 0) {
            // Extract the property IDs from the response and dispatch to set the favoriteIds
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
      // If the user is not logged in, check for saved favorite IDs in localStorage
      const savedFavoriteIds = localStorage.getItem('favouriteIds');
      if (savedFavoriteIds) {
        // Set the favoriteIds in Redux if they are saved in localStorage
        dispatch(setFavoriteIds(savedFavoriteIds.split(',')));
      }
    }
  }, [dispatch, token]);

  // Function to handle when a property is clicked to add or remove from favorites
  const handleFavoriteClick = (event: React.MouseEvent, propertyId: string) => {
    event.preventDefault(); // Prevent any default behavior, like page navigation

    if (token) {
      // If the user is logged in, add or remove the property from favorites via the backend
      dispatch(addToFavorites(propertyId))
        .unwrap() // Unwrap to get the result instead of the action object
        .then(() => {
          // Update the Redux store with the new favoriteIds list
          dispatch(setFavoriteIds(favoriteIds.includes(propertyId)
            ? favoriteIds.filter(id => id !== propertyId) // Remove property ID from favorites
            : [...favoriteIds, propertyId] // Add property ID to favorites
          ));
        })
        .catch((err: Error) => {
          console.error('Error adding to favorites:', err); // Handle any errors that occur
        });
    } else {
      // If the user is not logged in, update favorites in localStorage
      const updatedIds = favoriteIds.includes(propertyId)
        ? favoriteIds.filter(id => id !== propertyId) // Remove property ID from favorites
        : [...favoriteIds, propertyId]; // Add property ID to favorites

      // Save the updated favoriteIds in localStorage
      localStorage.setItem('favouriteIds', updatedIds.join(','));

      // Dispatch the updated favoriteIds to the Redux store
      dispatch(setFavoriteIds(updatedIds));
    }
  };

  // Show loading state while properties are being fetched
  if (loading) {
    return <div>Loading properties...</div>;
  }

  // Show error message if there's an issue fetching properties
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Show a message if no properties are available
  if (!properties || properties.length === 0) {
    return <div>No properties available.</div>;
  }

  // Filter properties to only include those that are in the favoriteIds list
  const favoriteProperties = properties.filter((property) => favoriteIds.includes(property._id));

  // Show a message if no favorite properties are found
  if (favoriteProperties.length === 0) {
    return <div>No favorite properties found.</div>;
  }

  // Render the list of favorite properties
  return (
    <div>
      <div className="listings-header">
        <h2>Favorite Listings</h2>
        <span className="listings-count">You've got {favoriteProperties.length} favorite choices</span>
      </div>

      <div className="property-grid">
        {/* Map through the favoriteProperties array to render each property */}
        {favoriteProperties.map((property) => (
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
                {property.economic_information?.another_fee ? "No fee" : "Fee applies"}
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
  );
};

export default SavedPropertiesListing;
