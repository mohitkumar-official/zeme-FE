import React, { useState } from 'react';
import PropertiesContext from './PropertiesContext';


const PropertiesState = (props) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch properties from API
    const fetchProperties = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8000/api/property/fetch-properties`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') // Ensure token is stored correctly
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch properties');
            }

            const data = await response.json();

            if (data.properties && Array.isArray(data.properties)) {
                setProperties(data.properties);
            } else {
                console.error("API response does not contain a valid properties array:", data);
                setProperties([]);
            }
        } catch (err) {
            console.error('Error fetching properties:', err);
            setError(err.message);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <PropertiesContext.Provider value={{ properties, fetchProperties, loading, error }}>
            {props.children}
        </PropertiesContext.Provider>
    );
};

export default PropertiesState;
