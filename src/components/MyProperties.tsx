import React, { useContext, useEffect, useState } from 'react';
import PropertiesContext from '../context/properties/PropertiesContext';
import { Pencil } from "lucide-react"
import MultiStepPropertyForm from './MultiStepForm';
import { FormData } from '../types/property';

// Defining the structure of Property and other necessary types for TypeScript
interface Property extends FormData {
    _id: string;
    // images?: { image_url: string }[]; // Array of image objects
    // basic_information?: {
    //     address: string;
    //     unit: string;
    //     floor: string;
    //     square_feet: number;
    //     bedrooms: number;
    //     bathrooms: number;
    // };
    // economic_information?: {
    //     gross_rent: number;
    //     another_fee: boolean;
    // };
}

interface PropertiesContextType {
    properties: Property[]; // List of properties in the context
    addToFavorites: ({ propertyId }: { propertyId: string }) => Promise<any>; // Update this line
    fetchMyProperties: () => void; // Function to fetch properties
    loading: boolean; // Loading state
    error: string | null; // Error state
}

const MyProperties: React.FC = () => {
    const context = useContext(PropertiesContext) as unknown as PropertiesContextType; // Type casting for context
    const { properties, addToFavorites, fetchMyProperties, loading, error } = context;
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]); // State to manage favorite IDs
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);


    useEffect(() => {
        fetchMyProperties(); // Fetch properties when the component mounts
        // eslint-disable-next-line
    }, []);

    // Function to handle clicking on the favorite button
    const handleFavoriteClick = (event: React.MouseEvent, propertyId: string) => {
        event.preventDefault();  // Prevent any default action

        const token = localStorage.getItem('token'); // Check if the user is logged in
        if (token) {
            // If the user is logged in, add to favorites via the backend
            addToFavorites({ propertyId });
            setFavoriteIds(prevIds =>
                prevIds.includes(propertyId)
                    ? prevIds.filter(id => id !== propertyId)
                    : [...prevIds, propertyId]
            );
        } else {
            // If the user is not logged in, toggle the favorite in localStorage
            setFavoriteIds(prevIds => {
                const updatedIds = prevIds.includes(propertyId)
                    ? prevIds.filter(id => id !== propertyId) // Remove from favorites
                    : [...prevIds, propertyId]; // Add to favorites

                // Save the updated favoriteIds to localStorage
                localStorage.setItem('favouriteIds', updatedIds.join(','));

                return updatedIds; // Return the updated state
            });
        }
    };

    const handleEdit = (propertyId: string) => {
        const property = properties.find(p => p._id === propertyId);
        console.log(property);
        if (property) {
            setEditingProperty(property);
        }
    };

    if (loading) {
        return <div>Loading properties...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!properties || properties.length === 0) {
        return <div>No properties available.</div>;
    }

    return (
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

                            {/* Edit Button */}
                            <button
                                className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                                onClick={() => handleEdit(property._id)}
                            >
                                <Pencil className="w-4 h-4" />
                            </button>


                            {/* Favorite Button */}
                            {/* <button
                                className="btn-favorite"
                                onClick={(event) => handleFavoriteClick(event, property._id)}
                            >
                                {favoriteIds.includes(property._id) ? '❤️' : '🤍'}
                            </button> */}

                            {/* Fee Tag */}
                            <span className="tag-no-fee">
                                {property.economic_information?.another_fee ? "No fee" : "Fee applies"}
                            </span>
                        </div>

                        <div className="property-info">
                            <div className="price">${property.economic_information?.gross_rent || 'N/A'}/mo</div>
                            <h3>{property.basic_information?.address || 'Unknown Address'}</h3>
                            <p>
                                {property.basic_information?.unit ? `Unit ${property.basic_information.unit}, ` : ''}
                                {property.basic_information?.floor ? `Floor ${property.basic_information.floor}, ` : ''}
                                {property.basic_information?.sqauare_feet || 'N/A'} sq ft
                            </p>
                            <div className="property-details">
                                <span>{property.basic_information?.bedrooms || 'N/A'} bedrooms</span>
                                <span>{property.basic_information?.bathrooms || 'N/A'} bathrooms</span>
                            </div>
                        </div>
                    </div>
                ))}
                {editingProperty && (
                    <MultiStepPropertyForm
                        onClose={() => setEditingProperty(null)}
                        editMode={true}
                        propertyData={editingProperty}  // Pass selected property data
                    />
                )}
            </div>
        </div>

    );
};

export default MyProperties;
