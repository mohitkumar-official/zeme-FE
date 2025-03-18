import React, { useState, ReactNode } from 'react';
import PropertiesContext from './PropertiesContext';

// Define types for properties and context
interface Property {
    id: string;
    name: string;
    location: string;
    price: number;
    [key: string]: any; // Allow additional properties
}

interface PropertiesStateProps {
    children: ReactNode;
}

interface FetchFilters {
    [key: string]: any;
}

interface AddToFavoritesParams {
    propertyId: string;
}

// interface PropertyContextType {
//     properties: Property[];
//     fetchProperties: (filters?: FetchFilters) => Promise<void>;
//     setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
//     fetchFavourites: () => Promise<any>;
//     addToFavorites: (propertyId: string) => Promise<any>;
//     fetchMyProperties: () => Promise<void>;
//     addProperty: (propertyData: any) => Promise<any>;
//     loading: boolean;
//     error: string | null;
//     filters: FetchFilters;
//     setFilters: React.Dispatch<React.SetStateAction<FetchFilters>>;
// }

const PropertiesState: React.FC<PropertiesStateProps> = ({ children }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FetchFilters>({});

    // Fetch properties from API (Create - Fetch)
    const fetchProperties = async (filters?: FetchFilters): Promise<void> => {
        setLoading(true);
        setError(null);
        setFilters(filters || {});

        try {
            const response = await fetch(`http://localhost:8000/api/property/fetch-properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || '' // Ensure token is stored correctly
                },
                body: filters ? JSON.stringify(filters) : undefined
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
        } catch (err: any) {
            console.error('Error fetching properties:', err);
            setError(err.message);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch favorite properties (Read - Fetch Favourites)
    const fetchFavourites = async (): Promise<any> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:8000/api/property/fetch-favourites`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || ''
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch favourites');
            }

            return await response.json();
        } catch (err: any) {
            console.error('Error fetching favourites:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Add to favorites (Update - Add to Favourites)
    const addToFavorites = async ({ propertyId }: AddToFavoritesParams): Promise<any> => {
        try {
            const response = await fetch(`http://localhost:8000/api/property/add-to-favourites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || ''
                },
                body: JSON.stringify({ propertyId })
            });

            if (!response.ok) {
                throw new Error('Failed to add to favourites');
            }

            return await response.json();
        } catch (err: any) {
            console.error('Error adding to favourites:', err);
            setError(err.message);
        }
    };

    // Fetch user properties
    const fetchMyProperties = async (): Promise<void> => {
        try {
            const response = await fetch(`http://localhost:8000/api/property/my-properties`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || ''
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch my properties');
            }

            const data = await response.json();
            setProperties(Array.isArray(data.properties) ? data.properties : []);
        } catch (err: any) {
            console.error('Error fetching my properties:', err);
            setError(err.message);
        }
    };

    // Add a property
    const addProperty = async (propertyData: any): Promise<any> => {
        try {
            const response = await fetch(`http://localhost:8000/api/property/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || ''
                },
                body: JSON.stringify(propertyData)
            });

            if (!response.ok) {
                throw new Error('Failed to add property');
            }

            return await response.json();
        } catch (err: any) {
            console.error('Error adding property:', err);
            setError(err.message);
        }
    };

    return (
        <PropertiesContext.Provider value={{ properties, fetchProperties, setProperties, fetchFavourites, addToFavorites, fetchMyProperties, addProperty, loading, error, filters, setFilters }}>
            {children}
        </PropertiesContext.Provider>
    );
};

export default PropertiesState;
