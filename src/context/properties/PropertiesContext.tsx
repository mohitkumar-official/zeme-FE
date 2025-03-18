import { createContext } from "react";

// Define the type for the context
interface PropertiesContextType {
    properties: any[];
    fetchProperties: (filters?: any) => Promise<void>;
    setProperties: React.Dispatch<React.SetStateAction<any[]>>;
    fetchFavourites: () => Promise<any>;
    addToFavorites: ({ propertyId, action }: { propertyId: string; action: string }) => Promise<any>;
    fetchMyProperties: () => Promise<void>;
    addProperty: (propertyData: any) => Promise<any>;
    loading: boolean;
    error: string | null;
    filters: any;
    setFilters: React.Dispatch<React.SetStateAction<any>>;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);
export default PropertiesContext;
