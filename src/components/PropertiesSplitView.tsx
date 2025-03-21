// Import React core functionality and hooks for component management
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
// Import Redux hooks for state management and dispatch actions
import { useSelector, useDispatch } from 'react-redux';
// Import Redux actions for managing favorites
import { addToFavorites, setFavoriteIds } from '../features/properties/PropertiesSlice';
// Import Redux store types
import { AppDispatch, RootState } from '../redux/store';
// Import Mapbox GL JS library for map functionality
import mapboxgl from 'mapbox-gl';
// Import Mapbox CSS styles
import 'mapbox-gl/dist/mapbox-gl.css';

// Set the Mapbox access token from environment variables or empty string as fallback
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN || '';

// Define the main PropertiesSplitView component as a functional component
const PropertiesSplitView: React.FC = () => {
  // Extract properties and favorite IDs from Redux store state
  const { properties, favoriteIds } = useSelector((state: RootState) => state.properties);
  // Get dispatch function from Redux for dispatching actions
  const dispatch = useDispatch<AppDispatch>();
  
  // State for tracking selected property ID
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  // State for tracking if map has finished loading
  const [mapLoaded, setMapLoaded] = useState(false);
  // Get authentication token from localStorage
  const token = localStorage.getItem('token');

  // Ref for the map container DOM element
  const mapContainer = useRef<HTMLDivElement>(null);
  // Ref for the Mapbox map instance
  const map = useRef<mapboxgl.Map | null>(null);
  // Ref for storing map markers
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  // Effect hook for initializing the map
  useEffect(() => {
    // Check if Mapbox token is available
    if (!mapboxgl.accessToken) {
      console.error('Mapbox token is not set');
      return;
    }

    // Initialize map if not already created and container exists
    if (!map.current && mapContainer.current) {
      // Create new Mapbox map instance with configuration
      map.current = new mapboxgl.Map({
        container: mapContainer.current, //right portion of the screen
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [78.9629, 20.5937], // Center of India
        zoom: 4,
        minZoom: 3.5,
        maxZoom: 16,
        maxBounds: [ //maxBounds restricts the area the user can move around in the map.
          [68.1766, 6.7433],
          [97.4025, 35.6745]
        ],
        maxPitch: 0,
        dragRotate: false,
        bearing: 0
      });

      // Add navigation controls to the map
      map.current.addControl( //like + and -
        new mapboxgl.NavigationControl({ 
          showCompass: false,
          showZoom: true
        }), 
        'top-right'
      );

      // Set up map load event handler
      map.current.on('load', () => {
        setMapLoaded(true);
        // Fit bounds to show all markers if no property is selected
        if (!selectedProperty && Object.keys(markers.current).length === 0) {
          map.current?.fitBounds([
            [68.1766, 6.7433],
            [97.4025, 35.6745]
          ], {
            padding: 50,
            duration: 0
          });
        }
      });
    }

    // Cleanup function to remove map when component unmounts
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Empty dependency array means this effect runs only on mount

  // Memoized function to create map markers
  const createMarkers = useCallback((map: mapboxgl.Map) => {
    // Create bounds object for fitting map view
    const bounds = new mapboxgl.LngLatBounds();
    // Object to store new markers
    const newMarkers: { [key: string]: mapboxgl.Marker } = {};

    // Iterate through properties to create markers
    properties.forEach(property => {
      // Check if property has coordinates
      if (property.basic_information?.coordinates) {
        const { lat, lng } = property.basic_information.coordinates;
        
        // Create marker element
        const el = document.createElement('div');
        el.className = 'cursor-pointer transition-transform duration-200 hover:scale-110';
        
        // Calculate price range and color
        const price = property.economic_information?.gross_rent || 0;
        const priceRange = price < 1000 ? 'low' : price < 2000 ? 'medium' : 'high';
        const colors = {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
        };
        const color = colors[priceRange as keyof typeof colors];
        const isSelected = property._id === selectedProperty;
        const size = isSelected ? '36px' : '30px';
        
        // Style the marker element
        el.style.cssText = `
          width: ${size};
          height: ${size};
          background-color: ${color};
          border-radius: 50%;
          border: 2px solid white;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 12px;
        `;
        
        // Format price for display
        const displayPrice = price >= 1000 ? `$${Math.floor(price/1000)}K` : `$${price}`;
        el.textContent = displayPrice;

        // Create popup content
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="font-sans">
            ${property.images?.[0]?.image_url ? 
              `<img class="w-full h-[150px] object-cover" src="http://localhost:8000${property.images[0].image_url}" alt="${property.basic_information?.address || 'Property'}" />` 
              : ''
            }
            <div class="p-4">
              <div class="text-lg font-bold text-gray-900 mb-1">$${(property.economic_information?.gross_rent || 0).toLocaleString()}/mo</div>
              <div class="text-sm text-gray-600 mb-2">${property.basic_information?.address || ''}</div>
              <div class="flex gap-3 text-sm text-gray-500 mb-3">
                <span>${property.basic_information?.bedrooms || 'N/A'} beds</span>
                <span>${property.basic_information?.bathrooms || 'N/A'} baths</span>
                <span>${(property.basic_information?.square_feet || 0).toLocaleString()} sq ft</span>
              </div>
              <button 
                class="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors"
                onclick="document.getElementById('property-${property._id}').scrollIntoView({behavior: 'smooth', block: 'center'})"
              >
                View Details
              </button>
            </div>
          </div>
        `);

        // Create and add marker to map
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);

        // Add click event listener to marker
        el.addEventListener('click', () => {
          handlePropertySelect(property._id);
        });

        // Store marker reference
        newMarkers[property._id] = marker;
        // Extend bounds to include marker
        bounds.extend([lng, lat]);
      }
    });

    // Return markers and bounds
    return { markers: newMarkers, bounds };
  }, [properties]); // Remove selectedProperty from dependencies

  // Effect hook to update markers when properties or selection changes
  useEffect(() => {
    // Return early if map is not ready
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    Object.values(markers.current).forEach(marker => marker.remove());

    // Create new markers
    const { markers: newMarkers, bounds } = createMarkers(map.current);
    markers.current = newMarkers;

    // Fit bounds if multiple properties exist
    if (Object.keys(newMarkers).length > 1) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }

    // Handle selected property changes
    if (selectedProperty) {
      const selected = properties.find(p => p._id === selectedProperty);
      if (selected?.basic_information?.coordinates) {
        map.current.flyTo({
          center: [
            selected.basic_information.coordinates.lng,
            selected.basic_information.coordinates.lat
          ],
          zoom: 15,
          essential: true
        });
      }
    }
  }, [properties, selectedProperty, mapLoaded, createMarkers]);

  // Separate effect for updating marker styles when selection changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Update marker styles for selected property
    Object.entries(markers.current).forEach(([propertyId, marker]) => {
      const property = properties.find(p => p._id === propertyId);
      if (property?.basic_information?.coordinates) {
        const price = property.economic_information?.gross_rent || 0;
        const priceRange = price < 1000 ? 'low' : price < 2000 ? 'medium' : 'high';
        const colors = {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
        };
        const color = colors[priceRange as keyof typeof colors];
        const isSelected = propertyId === selectedProperty;
        const size = isSelected ? '36px' : '30px';

        const el = marker.getElement();
        el.style.width = size;
        el.style.height = size;
        el.style.backgroundColor = color;
      }
    });
  }, [selectedProperty, properties, mapLoaded]);

  // Memoized handler for favorite button clicks
  const handleFavoriteClick = useCallback((event: React.MouseEvent, propertyId: string) => {
    // Prevent event bubbling
    event.preventDefault();
    event.stopPropagation();

    // Function to update favorites
    const updateFavorites = (updatedIds: string[]) => {
      if (token) {
        // If user is logged in, update favorites through API
        dispatch(addToFavorites(propertyId))
          .unwrap()
          .then(() => {
            dispatch(setFavoriteIds(updatedIds));
          })
          .catch((err:Error) => {
            console.error('Error adding to favorites:', err);
          });
      } else {
        // If user is not logged in, update localStorage
        localStorage.setItem('favouriteIds', updatedIds.join(','));
        dispatch(setFavoriteIds(updatedIds));
      }
    };

    // Update favorite IDs
    const updatedIds = favoriteIds.includes(propertyId)
      ? favoriteIds.filter((id) => id !== propertyId)
      : [...favoriteIds, propertyId];

    updateFavorites(updatedIds);
  }, [token, favoriteIds, dispatch]);

  // Handler for property selection
  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperty(propertyId);
    // Scroll selected property into view
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Render the component
  return (
    <div className="flex h-screen">
      {/* Left side - Properties List */}
      <div className="w-1/2 overflow-y-auto p-4 bg-white">
        {/* Header section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Listings</h2>
          <span className="text-sm text-gray-600">You've got {properties.length} property choices</span>
        </div>

        {/* Property cards grid */}
        <div className="grid grid-cols-2 gap-4 pb-4">
          {properties.map((property) => (
            <div 
              key={property._id} 
              id={`property-${property._id}`}
              className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer
                ${selectedProperty === property._id ? 'ring-2 ring-blue-500 ring-offset-2' : 'border border-gray-200'}`}
              onClick={() => handlePropertySelect(property._id)}
            >
              {/* Property image and favorite button */}
              <div className="relative h-36">
                <img
                  src={property.images?.[0]?.image_url ? `http://localhost:8000${property.images[0].image_url}` : 'default-image.jpg'}
                  alt={property.basic_information?.address || 'Property Image'}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(event) => handleFavoriteClick(event, property._id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center transition-transform hover:scale-110"
                >
                  {favoriteIds.includes(property._id) ? '❤️' : '🤍'}
                </button>
                <span className="absolute bottom-2 left-2 px-2 py-1 text-xs font-medium text-white bg-black/70 rounded">
                  {property.economic_information?.has_another_fee ? "No fee" : "Fee applies"}
                </span>
              </div>

              {/* Property information section */}
              <div className="p-3">
                <div className="text-lg font-bold text-gray-900 mb-1">
                  ${property.economic_information?.gross_rent || 'N/A'}/mo
                </div>
                <h3 className="text-sm text-gray-700 mb-1">{property.basic_information?.address || 'Unknown Address'}</h3>
                <p className="text-xs text-gray-600 mb-2">
                  {property.basic_information?.unit ? `Unit ${property.basic_information.unit}, ` : ''}
                  {property.basic_information?.floor ? `Floor ${property.basic_information.floor}, ` : ''}
                  {property.basic_information?.square_feet || 'N/A'} sq ft
                </p>
                <div className="flex gap-3 text-xs text-gray-600">
                  <span>{property.basic_information?.bedrooms || 'N/A'} bedrooms</span>
                  <span>{property.basic_information?.bathrooms || 'N/A'} bathrooms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Map */}
      <div className="w-1/2 relative">
        {/* Loading spinner */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        {/* Map container */}
        <div 
          ref={mapContainer} 
          className="w-full h-full min-h-screen"
        />
      </div>
    </div>
  );
};

// Export the component
export default PropertiesSplitView;