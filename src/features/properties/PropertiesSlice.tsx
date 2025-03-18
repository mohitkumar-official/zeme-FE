import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// Define Types
interface Property {
    id: string;
    [key: string]: any;
}
interface FilterRequestBody {
    filters?: {
        keyword?: string;
        sort?: string;
    };
}

interface PropertiesState {
    properties: Property[];
    loading: boolean;
    error: string | null;
    filters: FilterRequestBody;
    favoriteIds: string[];
}

// Initial state
const initialState: PropertiesState = {
    properties: [],
    loading: false,
    error: null,
    // filters: { filters: {} }, // Initialize filters correctly
    filters: { filters: { keyword: "", sort: "" }}, // ✅ Ensure filters is always an object
    favoriteIds: [],
};

// 🔹 Async Thunks for API Calls
export const fetchProperties = createAsyncThunk<Property[], FilterRequestBody>(
    "properties/fetchProperties",
    async ({ filters}, { rejectWithValue }) => { 
        try {
            const response = await fetch(`http://localhost:8000/api/property/fetch-properties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || '',
                },
                body: JSON.stringify({ filters  : filters || {}}),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch properties");
            }

            const data = await response.json();
            return Array.isArray(data.properties) ? data.properties : [];
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchFavourites = createAsyncThunk<any>(
    "properties/fetchFavourites",
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:8000/api/property/fetch-favourites`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || '',
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch favourites");
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const addToFavorites = createAsyncThunk<any, string>(
    "properties/addToFavorites",
    async (propertyId, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:8000/api/property/add-to-favourites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token') || '',
                },
                body: JSON.stringify({ propertyId }),
            });

            if (!response.ok) {
                throw new Error("Failed to add to favourites");
            }

            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// 🔹 Slice
const propertiesSlice = createSlice({
    name: "properties",
    initialState,
    reducers: {
        setFilterss: (state, action: PayloadAction<FilterRequestBody>) => {
            state.filters = action.payload || { filters: {} };
            // state.filters = action.payload.filters ?? { keyword: "", sort: "" }; // ✅ Default to empty object
        },
        setFavoriteIds: (state, action: PayloadAction<string[]>) => {
            state.favoriteIds = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = action.payload;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchFavourites.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFavourites.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchFavourites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addToFavorites.pending, (state) => {
                state.loading = true;
            })
            .addCase(addToFavorites.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addToFavorites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setFilterss, setFavoriteIds } = propertiesSlice.actions;
export default propertiesSlice.reducer;
