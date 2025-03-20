// Import necessary dependencies and components for React and state management
import React, { useEffect, useState, useMemo } from 'react';
// Import Leaflet map components for interactive mapping functionality
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// Import Leaflet CSS for map styling
import 'leaflet/dist/leaflet.css';
// Import custom map styles
import '../styles/map.css';
// Import Leaflet core library for map functionality
import L from 'leaflet';
// Import Redux hooks for state management
import { useSelector, useDispatch } from 'react-redux';
// Import Redux actions for property management
import { addToFavorites, setFavoriteIds } from '../features/properties/PropertiesSlice';
// Import TypeScript types for Redux store and dispatch
import { AppDispatch, RootState } from '../redux/store';

// Fix Leaflet's default icon issue in React by manually setting icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  // Set high-resolution icon for retina displays
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  // Set standard resolution icon
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // Set shadow image for markers
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Define TypeScript interface for property data structure
interface Property {
  // Unique identifier for each property
  _id: string;
  // Optional array of property images
  images?: { image_url: string }[];
  // Optional basic property information
  basic_information?: {
    address: string;
    unit?: string;
    floor?: string;
    square_feet?: number;
    bedrooms?: number;
    bathrooms?: number;
    // Geographic coordinates for map placement
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  // Optional economic information
  economic_information?: {
    gross_rent: number;
    has_another_fee: boolean;
  };
}

// Component to handle map center updates when location changes
const MapCenterUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  // Get reference to map instance
  const map = useMap();
  
  // Update map view when center coordinates change
  useEffect(() => {
    // Set new map view with animation
    map.setView(center, 13, { animate: true });
  }, [center, map]);
  
  // Component doesn't render anything visible
  return null;
};

// Component to adjust map bounds to show all markers
const FitBoundsToMarkers: React.FC<{ bounds: L.LatLngBounds | undefined }> = ({ bounds }) => {
  // Get reference to map instance
  const map = useMap();
  
  // Adjust map view to fit all markers when bounds change
  useEffect(() => {
    // Only adjust if bounds exist and are valid
    if (bounds && bounds.isValid()) {
      // Fit map to bounds with padding and animation
      map.fitBounds(bounds, { 
        padding: [50, 50], // Add padding around markers
        animate: true,     // Enable smooth animation
        maxZoom: 15       // Limit maximum zoom level
      });
    }
  }, [map, bounds]);
  
  // Component doesn't render anything visible
  return null;
};

// Main component for the split view (list and map)
const PropertiesSplitView: React.FC = () => {
  // Get properties and favorite IDs from Redux store
  const { properties, favoriteIds } = useSelector((state: RootState) => state.properties);
  // Get dispatch function for Redux actions
  const dispatch = useDispatch<AppDispatch>();
  
  // Local state management
  // Track currently selected property
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  // Set initial map center (Delhi coordinates)
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]);
  // Track map loading state
  const [mapLoaded, setMapLoaded] = useState(false);
  // Get authentication token from local storage
  const token = localStorage.getItem('token');

  // Create custom map markers based on property price
  const createCustomIcon = (property: any, isSelected: boolean) => {
    // Get property price or default to 0
    const price = property.economic_information?.gross_rent || 0;
    // Determine price range category
    const priceRange = price < 1000 ? 'low' : price < 2000 ? 'medium' : 'high';
    
    // Define color scheme for different price ranges
    const colors = {
      low: '#10B981',    // Green for low prices
      medium: '#F59E0B', // Amber for medium prices
      high: '#EF4444',   // Red for high prices
    };
    
    // Get color based on price range
    const color = colors[priceRange as keyof typeof colors];
    // Adjust size based on selection state
    const size = isSelected ? 36 : 30;
    
    // Format price for display (K for thousands)
    const displayPrice = price >= 1000 
      ? `$${Math.floor(price/1000)}K` 
      : `$${price}`;
    
    // Create and return custom div icon
    return L.divIcon({
      // Set CSS classes for styling
      className: `custom-marker-icon ${isSelected ? 'selected-marker' : ''}`,
      // Create HTML structure for marker
      html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-center; border-radius: 50%; color: white; font-weight: bold; border: 2px solid white;">${displayPrice}</div>`,
      // Set icon dimensions
      iconSize: [size, size],
      // Set icon anchor point
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Update map center when properties list changes
  useEffect(() => {
    // Check if properties exist
    if (properties.length > 0) {
      const firstProperty = properties[0];
      // Update map center if coordinates exist
      if (firstProperty.basic_information?.coordinates) {
        setMapCenter([
          firstProperty.basic_information.coordinates.lat,
          firstProperty.basic_information.coordinates.lng
        ]);
      }
    }
  }, [properties]);

  // Handle adding/removing properties to favorites
  const handleFavoriteClick = (event: React.MouseEvent, propertyId: string) => {
    // Prevent event bubbling
    event.preventDefault();
    event.stopPropagation();

    if (token) {
      // If user is logged in, update favorites in backend
      dispatch(addToFavorites(propertyId))
        .unwrap()
        .then(() => {
          // Update favorite IDs in Redux store
          dispatch(
            setFavoriteIds(
              favoriteIds.includes(propertyId)
                ? favoriteIds.filter((id) => id !== propertyId) // Remove if exists
                : [...favoriteIds, propertyId]                  // Add if doesn't exist
            )
          );
        })
        .catch((err:Error) => {
          console.error('Error adding to favorites:', err);
        });
    } else {
      // If user is not logged in, store favorites in localStorage
      const updatedIds = favoriteIds.includes(propertyId)
        ? favoriteIds.filter((id) => id !== propertyId) // Remove if exists
        : [...favoriteIds, propertyId];                 // Add if doesn't exist

      // Save to localStorage and update Redux store
      localStorage.setItem('favouriteIds', updatedIds.join(','));
      dispatch(setFavoriteIds(updatedIds));
    }
  };

  // Handle property selection and map centering
  const handlePropertySelect = (propertyId: string) => {
    // Update selected property state
    setSelectedProperty(propertyId);
    // Find selected property
    const property = properties.find(p => p._id === propertyId);
    // Update map center if coordinates exist
    if (property?.basic_information?.coordinates) {
      setMapCenter([
        property.basic_information.coordinates.lat,
        property.basic_information.coordinates.lng
      ]);
    }
    // Scroll selected property into view
    const element = document.getElementById(`property-${propertyId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Filter properties that have valid coordinates for mapping
  const propertiesWithCoordinates = useMemo(() => {
    return properties.filter(p => 
      p.basic_information?.coordinates?.lat && 
      p.basic_information.coordinates.lng
    );
  }, [properties]);

  // Calculate bounds to fit all property markers
  const mapBounds = useMemo(() => {  //In React, useMemo is a hook that memoizes (or "remembers") the result of a computation and reuses it when the same inputs occur again. This is useful for optimizing performance by avoiding unnecessary re-renders or computations.
    // Return undefined if no properties with coordinates
    if (propertiesWithCoordinates.length === 0) return undefined;
    
    // Create bounds object from property coordinates
    const bounds = L.latLngBounds(
      propertiesWithCoordinates.map(p => [
        p.basic_information!.coordinates!.lat,
        p.basic_information!.coordinates!.lng
      ] as [number, number])
    );
    
    return bounds;
  }, [propertiesWithCoordinates]);

  // Render component
  return (
    <div className="flex h-screen">
      {/* Left side - Properties List */}
      <div className="w-1/2 overflow-y-auto p-4 bg-white">
        {/* Header section */}
        <div className="listings-header">
          <h2>Property Listings</h2>
          <span className="listings-count">You've got {properties.length} property choices</span>
        </div>

        {/* Property cards grid */}
        <div className="property-grid">
          {/* Map through properties and render cards */}
          {properties.map((property) => (
            <div 
              className={`property-card ${selectedProperty === property._id ? 'selected' : ''}`} 
              key={property._id} 
              id={`property-${property._id}`}
              onClick={() => handlePropertySelect(property._id)}
            >
              {/* Property image and favorite button */}
              <div className="property-image relative">
                <img
                  src={property.images?.[0]?.image_url ? `http://localhost:8000${property.images[0].image_url}` : 'default-image.jpg'}
                  alt={property.basic_information?.address || 'Property Image'}
                />
                {/* Favorite toggle button */}
                <button
                  className="btn-favorite"
                  onClick={(event) => handleFavoriteClick(event, property._id)}
                >
                  {favoriteIds.includes(property._id) ? '❤️' : '🤍'}
                </button>
                {/* Fee status tag */}
                <span className="tag-no-fee">
                  {property.economic_information?.has_another_fee ? "No fee" : "Fee applies"}
                </span>
              </div>
              {/* Property information section */}
              <div className="property-info">
                {/* Price display */}
                <div className="price">${property.economic_information?.gross_rent || 'N/A'}/mo</div>
                {/* Address */}
                <h3>{property.basic_information?.address || 'Unknown Address'}</h3>
                {/* Unit and floor information */}
                <p>
                  {property.basic_information?.unit ? `Unit ${property.basic_information.unit}, ` : ''}
                  {property.basic_information?.floor ? `Floor ${property.basic_information.floor}, ` : ''}
                  {property.basic_information?.square_feet || 'N/A'} sq ft
                </p>
                {/* Property details */}
                <div className="property-details">
                  <span>{property.basic_information?.bedrooms || 'N/A'} bedrooms</span>
                  <span>{property.basic_information?.bathrooms || 'N/A'} bathrooms</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Map */}
      <div className="w-1/2 h-full relative">
        {/* Loading spinner overlay */}
        {!mapLoaded && (
          <div className="map-loading">
            <div className="loading-spinner"></div>
          </div>
        )}

        {/* Map container component */}
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          whenReady={() => setMapLoaded(true)}
          zoomControl={false}
        >
          {/* Map center updater component */}
          <MapCenterUpdater center={mapCenter} />
          
          {/* Fit bounds component - only when multiple properties */}
          {mapBounds && propertiesWithCoordinates.length > 1 && (
            <FitBoundsToMarkers bounds={mapBounds} />
          )}
          
          {/* Map tile layer - provides the actual map imagery */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            maxZoom={19}
          />
          
          {/* Property markers on map */}
          {propertiesWithCoordinates.map((property) => (
            <Marker
              key={property._id}
              position={[
                property.basic_information!.coordinates!.lat,
                property.basic_information!.coordinates!.lng
              ]}
              icon={createCustomIcon(property, selectedProperty === property._id)}
              eventHandlers={{
                click: () => handlePropertySelect(property._id),
              }}
            >
              {/* Popup for each marker */}
              <Popup className="custom-popup">
                <div>
                  {/* Property image in popup */}
                  {property.images?.[0]?.image_url && (
                    <img 
                      className="popup-image"
                      src={`http://localhost:8000${property.images[0].image_url}`}
                      alt={property.basic_information?.address || 'Property'} 
                    />
                  )}
                  {/* Popup content */}
                  <div className="popup-content">
                    {/* Price display */}
                    <div className="popup-price">
                      ${(property.economic_information?.gross_rent || 0).toLocaleString()}/mo
                    </div>
                    {/* Address */}
                    <div className="popup-address">
                      {property.basic_information?.address}
                    </div>
                    {/* Property details */}
                    <div className="popup-details">
                      <span>{property.basic_information?.bedrooms || 'N/A'} beds</span>
                      <span>{property.basic_information?.bathrooms || 'N/A'} baths</span>
                      <span>{(property.basic_information?.square_feet || 0).toLocaleString()} sq ft</span>
                    </div>
                    {/* View details button */}
                    <button 
                      className="popup-button"
                      onClick={() => handlePropertySelect(property._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Map controls */}
          <div className="map-controls">
            {/* Fit to bounds button */}
            <button className="map-control-button" onClick={() => {
              // Get map instance
              const mapElement = document.querySelector('.leaflet-container') as HTMLElement;
              const map = mapElement ? (mapElement as any)._leaflet_map : null;
              // Fit to bounds if map and bounds exist
              if (map && mapBounds) {
                map.fitBounds(mapBounds, { padding: [50, 50] });
              }
            }}>
              {/* Button icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="8" y1="3" x2="8" y2="21"></line>
                <line x1="16" y1="3" x2="16" y2="21"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="16" x2="21" y2="16"></line>
                <line x1="3" y1="8" x2="21" y2="8"></line>
              </svg>
            </button>
          </div>
        </MapContainer>
      </div>
    </div>
  );
};

// Export component
export default PropertiesSplitView;