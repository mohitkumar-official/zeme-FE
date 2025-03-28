import { Router, RequestHandler } from 'express';
import fetchuser from '../middleware/fetchuser';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';

const router: Router = Router();

// REGISTER
router.post("/register", UserController.registerUser as RequestHandler);

// LOGIN
router.post("/login", UserController.loginUser as RequestHandler);

// Get logged in user details (login required)
router.get("/getuser", fetchuser, UserController.fetchUser as RequestHandler);

// Google authentication route
router.post('/google', AuthController.googleLogin as RequestHandler);

export default router;
