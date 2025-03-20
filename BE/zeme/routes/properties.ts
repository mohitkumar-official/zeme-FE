import { Router, Request, Response } from 'express';
import fetchuser from '../middleware/fetchuser';
import PropertiesController from '../controllers/PropertiesController';
import LocationController from '../controllers/LocationController';
import FileUploadController from '../controllers/FileUploadController';

const router: Router = Router();

// Public routes
router.post("/fetch-properties", async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.fetchProperties(req, res);
});

router.get("/nyc-locations", async (req: Request, res: Response): Promise<void> => {
    await LocationController.getNYCLocations(req, res);
});

// Protected routes
router.post("/add", fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.addProperty(req, res);
});

router.post('/add-to-favourites', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.addToFavourite(req, res);
});

router.get('/fetch-favourites', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.fetchFavourites(req, res);
});

router.get('/my-properties', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.myProperties(req, res);
});

router.get('/drafts', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.fetchDrafts(req, res);
});

// File upload endpoint
router.post("/upload", FileUploadController.upload.single("file"), (req, res) => {
    FileUploadController.uploadFile(req, res);
});

// Routes with URL parameters
router.patch('/:id/status', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.updatePropertyStatus(req, res);
});

router.put('/:id', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.updateProperty(req, res);
});

router.get('/:id', fetchuser, async (req: Request, res: Response): Promise<void> => {
    await PropertiesController.getProperty(req, res);
});

export default router;
