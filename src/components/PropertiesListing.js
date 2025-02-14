import React, { useContext, useEffect } from 'react';
import PropertiesContext from '../context/properties/PropertiesContext';


const PropertiesListing = () => {
    const context = useContext(PropertiesContext);
    

    const { properties, fetchProperties, loading, error } = context;
    useEffect(() => {
            fetchProperties();
        // eslint-disable-next-line
    }, []);

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
                        <div className="property-image">
                            <img
                                src={property.property_images?.[0]?.image_url || 'default-image.jpg'}
                                alt={property.basic_information?.address || 'Property Image'}
                            />
                            <button className="btn-favorite">❤️</button>
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
    );
};

export default PropertiesListing;