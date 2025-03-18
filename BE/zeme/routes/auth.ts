import { Router } from 'express';
import fetchuser from '../middleware/fetchuser';
import UserController from '../controllers/UserController';

const router: Router = Router();

// REGISTER
router.post("/register", UserController.registerUser);

// LOGIN
router.post("/login", UserController.loginUser);

// Get logged in user details (login required)
router.get("/getuser", fetchuser, UserController.fetchUser);

export default router;
