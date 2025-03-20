import { Request, Response } from 'express';
import { nycLocations, getAllNYCLocations } from '../config/nycLocations';

class LocationController {
    static async getNYCLocations(req: Request, res: Response) {
        try {
            const { borough } = req.query;
            let locations;

            // If borough is specified, get locations for that borough
            if (borough) {
                const boroughKey = (borough as string).toLowerCase();
                locations = nycLocations[boroughKey] || [];
            } else {
                // If no borough specified, get all locations
                locations = getAllNYCLocations();
            }

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

export default LocationController; 