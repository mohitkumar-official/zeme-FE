import { Request, Response } from "express";
import User from "../models/User";
import Favourite from "../models/Favourite";
import Property from "../models/Properties";
import axios from 'axios';

class PropertiesController {
    /**
     * Fetch properties with optional filtering and sorting.
     */
    static async fetchProperties(req: Request, res: Response): Promise<Response> {
        try {
            const requestData = req.body;
            console.log('Request Data:', requestData); // Debug log

            const SORTING_OPTIONS = [
                { value: "newest", label: "Newest to Oldest", sortField: "createdAt", order: -1 },
                { value: "oldest", label: "Oldest to Newest", sortField: "createdAt", order: 1 },
                { value: "lowToHigh", label: "Price Low to High", sortField: "economic_information.gross_rent", order: 1 },
                { value: "highToLow", label: "Price High to Low", sortField: "economic_information.gross_rent", order: -1 },
            ];

            function processFilters(filters: any) {
                let filterConditions: any = {
                    status: "published" // Always show only published properties
                };

                if (filters.keyword) {
                    filterConditions["basic_information.address"] = { $regex: filters.keyword, $options: "i" };
                }

                if (filters.bedrooms?.length) {
                    filterConditions["basic_information.bedrooms"] = { $in: filters.bedrooms.map(Number) };
                }

                if (filters.bathrooms?.length) {
                    filterConditions["basic_information.bathrooms"] = { $in: filters.bathrooms.map(Number) };
                }

                if (filters.minRent || filters.maxRent) {
                    filterConditions["economic_information.gross_rent"] = {};
                    if (filters.minRent) filterConditions["economic_information.gross_rent"].$gte = filters.minRent;
                    if (filters.maxRent) filterConditions["economic_information.gross_rent"].$lte = filters.maxRent;
                }

                if (filters.amenities?.length) {
                    filterConditions["amenities"] = { $in: filters.amenities };
                }

                return filterConditions;
            }

            // First, let's try to get all properties with status published
            let properties = await Property.find({ status: "published" });
            console.log('Initial Query Result Count:', properties.length);

            // If we have filters, then apply them
            if (requestData.filters) {
                const filterConditions = processFilters(requestData.filters);
                console.log('Filter Conditions:', filterConditions); // Debug log

                let sortCondition: { [key: string]: 1 | -1 } = { createdAt: -1 };
                if (requestData.filters.sort) {
                    const selectedSort = SORTING_OPTIONS.find((option) => option.label === requestData.filters.sort);
                    if (selectedSort) {
                        sortCondition = { [selectedSort.sortField]: selectedSort.order as 1 | -1 };
                    }
                }
                console.log('Sort Condition:', sortCondition); // Debug log

                properties = await Property.find(filterConditions).sort(sortCondition);
                console.log('Filtered Result Count:', properties.length); // Debug log
            }

            // Log a sample property to verify structure
            if (properties.length > 0) {
                const sampleProperty = properties[0];
                console.log('Sample Property:', {
                    id: sampleProperty._id,
                    address: sampleProperty.basic_information?.address,
                    coordinates: sampleProperty.basic_information?.coordinates,
                    hasCoordinates: !!sampleProperty.basic_information?.coordinates
                });
            }
            
            return res.status(200).json({ 
                message: "Properties fetched successfully", 
                properties,
                total: properties.length
            });
        } catch (error) {
            console.error('Error in fetchProperties:', error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    static async addProperty(req: Request, res: Response): Promise<Response> {
        try {
            const propertyData = req.body;
            const userId = (req as any).user.id;

            // Set the user ID
            propertyData.user = userId;

            // If status is not specified, default to draft
            if (!propertyData.status) {
                propertyData.status = 'draft';
            }

            // If trying to publish, validate required fields
            if (propertyData.status === 'published') {
                const property = new Property(propertyData);
                const validationError = await property.validateSync();
                if (validationError) {
                    return res.status(400).json({
                        message: "Cannot publish: missing required fields",
                        errors: validationError.errors
                    });
                }
            }

            // Create and save the property
            const property = new Property(propertyData);
            await property.save();

            return res.status(201).json({
                message: `Property ${propertyData.status === 'published' ? 'published' : 'saved as draft'} successfully`,
                property
            });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async addToFavourite(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.id;
            const { propertyId } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            const property = await Property.findById(propertyId);
            if (!property) return res.status(404).json({ message: "Property not found" });

            let favourite = await Favourite.findOne({ userId });

            if (favourite) {
                const propertyIndex = favourite.propertyIds.indexOf(propertyId);
                if (propertyIndex === -1) {
                    favourite.propertyIds.push(propertyId);
                    await favourite.save();
                    return res.status(200).json({ message: "Added to favourites", favourite });
                } else {
                    favourite.propertyIds.splice(propertyIndex, 1);
                    await favourite.save();
                    return res.status(200).json({ message: "Removed from favourites", favourite });
                }
            } else {
                favourite = new Favourite({ userId, propertyIds: [propertyId] });
                await favourite.save();
                return res.status(200).json({ message: "Added to favourites", favourite });
            }
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async fetchFavourites(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.id;
            const favourite = await Favourite.findOne({ userId });
            return res.status(200).json({ message: "Fetched successfully", properties: [favourite] });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async myProperties(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.id;
            const properties = await Property.find({ user: userId, status: "published" });
            return res.status(200).json({ properties });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    /**
     * Fetch draft properties for the logged-in user
     */
    static async fetchDrafts(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.id;
            const drafts = await Property.find({ user: userId, status: "draft" })
                .sort({ updatedAt: -1 }); // Sort by last updated, newest first
            return res.status(200).json({ drafts });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    /**
     * Get a single property by ID
     */
    static async getProperty(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;

            // Find the property and verify ownership
            const property = await Property.findOne({ _id: id, user: userId });
            if (!property) {
                return res.status(404).json({ message: "Property not found or unauthorized" });
            }

            return res.status(200).json({ 
                message: "Property fetched successfully",
                property 
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    /**
     * Update property status (draft/published)
     */
    static async updatePropertyStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const userId = (req as any).user.id;

            // Verify valid status
            if (!["draft", "published"].includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }

            // Find the property and verify ownership
            const property = await Property.findOne({ _id: id, user: userId });
            if (!property) {
                return res.status(404).json({ message: "Property not found or unauthorized" });
            }

            // If publishing, validate required fields
            if (status === "published") {
                const validationError = await property.validateSync();
                if (validationError) {
                    return res.status(400).json({ 
                        message: "Cannot publish: missing required fields",
                        errors: validationError.errors
                    });
                }
            }

            // Update status
            property.status = status;
            await property.save();

            return res.status(200).json({ 
                message: `Property ${status === 'published' ? 'published' : 'saved as draft'} successfully`,
                property 
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    /**
     * Update entire property
     */
    static async updateProperty(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userId = (req as any).user.id;

            // Find the property and verify ownership
            const property = await Property.findOne({ _id: id, user: userId });
            if (!property) {
                return res.status(404).json({ message: "Property not found or unauthorized" });
            }

            // If publishing, validate required fields
            if (updateData.status === "published") {
                const tempProperty = new Property({ ...property.toObject(), ...updateData });
                const validationError = await tempProperty.validateSync();
                if (validationError) {
                    return res.status(400).json({ 
                        message: "Cannot publish: missing required fields",
                        errors: validationError.errors
                    });
                }
            }

            // Update property with new data
            Object.assign(property, updateData);
            await property.save();

            return res.status(200).json({ 
                message: `Property updated successfully`,
                property 
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    /**
     * Delete a property
     */
    static async deleteProperty(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const userId = (req as any).user.id;

            // Find the property and verify ownership
            const property = await Property.findOne({ _id: id, user: userId });
            if (!property) {
                return res.status(404).json({ message: "Property not found or unauthorized" });
            }

            // Delete the property
            await Property.deleteOne({ _id: id });

            return res.status(200).json({ 
                message: "Property deleted successfully"
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async getNYCLocations(req: Request, res: Response) {
        try {
            const { query } = req.query;
            const searchQuery = query ? `${query}, New York City` : 'New York City';
            
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search`,
                {
                    params: {
                        q: searchQuery,
                        format: 'json',
                        limit: 50,
                        'accept-language': 'en',
                        countrycodes: 'us',
                        bounded: 1,
                        viewbox: '-74.2591,40.4774,-73.7002,40.9162', // NYC bounding box
                        polygon_geojson: 1
                    },
                    headers: {
                        'User-Agent': 'Zeme/1.0' // Required by Nominatim's terms of service
                    }
                }
            );

            const locations = response.data.map((location: any) => ({
                address: location.display_name,
                coordinates: {
                    lat: parseFloat(location.lat),
                    long: parseFloat(location.lon)
                },
                type: location.type,
                importance: location.importance,
                boundingbox: location.boundingbox
            }));

            res.json({
                success: true,
                data: locations
            });
        } catch (error) {
            console.error('Error fetching NYC locations:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch locations'
            });
        }
    }
}

export default PropertiesController;
