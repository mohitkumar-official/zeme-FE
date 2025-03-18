import { Router, Request, Response } from 'express';
import fetchuser from '../middleware/fetchuser';
import PropertiesController from '../controllers/PropertiesController';
import FileUploadController from '../controllers/FileUploadController';
import Property from '../models/Properties';

const router: Router = Router();

// Fetch properties
router.post("/fetch-properties", async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.fetchProperties(req, res);
});

// Add a new property (authentication required)
router.post("/add", fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.addProperty(req, res);
});

// Add or remove from favourites (authentication required)
router.post('/add-to-favourites', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.addToFavourite(req, res);
});

// Fetch favourite properties (authentication required)
router.get('/fetch-favourites', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.fetchFavourites(req, res);
});

// Fetch properties added by the logged-in user (authentication required)
router.get('/my-properties', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.myProperties(req, res);
});

// Fetch draft properties (authentication required)
router.get('/drafts', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.fetchDrafts(req, res);
});

// File upload endpoint
router.post("/upload", FileUploadController.upload.single("file"), (req, res) => {
    FileUploadController.uploadFile(req, res);
});

// Routes with URL parameters should come after specific routes
// Update property status (authentication required)
router.patch('/:id/status', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.updatePropertyStatus(req, res);
});

// Update entire property (authentication required)
router.put('/:id', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.updateProperty(req, res);
});

// Fetch a single property by ID (authentication required)
router.get('/:id', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.getProperty(req, res);
});

// Delete a property (authentication required)
// router.delete('/:id', fetchuser, async (req: Request, res: Response): Promise<void> => {
//     await PropertiesController.deleteProperty(req, res);
// });

export default router;
