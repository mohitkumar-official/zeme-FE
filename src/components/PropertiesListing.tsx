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

  return <PropertiesSplitView />;
};

export default PropertiesListing;
