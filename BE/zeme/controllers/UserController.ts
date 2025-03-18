import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User'; // Assuming your User model is correct
import { Document } from 'mongoose';

const JWT_SECRET = "mysecret@key";

interface UserDocument extends Document {
  email: string;
  password: string;
  // Include other fields based on your user schema
}

class UserController {
    /**
     * Fetch user details excluding the password.
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     */
    static async fetchUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findById((req as any).user.id).select("-password"); // Exclude password
            res.status(200).send(user);
        } catch (error) {
            res.status(500).json({ error: "Server Error" });
        }
    }

    /**
     * Register a new user and generate a JWT token.
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     */
    static async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const { password } = req.body;
            const salt = await bcrypt.genSalt(10); // Create salt
            const hashedPassword = await bcrypt.hash(password, salt); // Hash the password
            req.body.password = hashedPassword;
            
            const user = new User(req.body);
            await user.save();
            
            jwt.sign({ id: user._id }, JWT_SECRET, (err: any, token: string|undefined|null) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Token generation failed" });
                }
                res.status(201).send({ message: "User registered successfully", user, token });
            });
        } catch (error: any) {
            // Check for validation errors
            if (error.name === 'ValidationError') {
                const firstError = Object.values(error.errors as { [key: string]: { message: string } })[0].message;
                 res.status(400).json({ error: firstError });
            }

            // Handle unique field errors (e.g., duplicate email)
            if (error.code === 11000) {
                 res.status(400).json({ error: "Email already exists" });
            }

            // Default server error
            res.status(500).json({ error: "Server Error" });
        }
    }

    /**
     * Log in an existing user and generate a JWT token.
     * @param {Request} req - Express request object.
     * @param {Response} res - Express response object.
     */
    static async loginUser(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body;
        let success = false;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                 res.status(401).json({ error: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user!.password);
            if (!isMatch) {
                 res.status(401).json({ error: "Invalid credentials" });
            }

            jwt.sign({ id: user?._id }, JWT_SECRET, (err: any, token: string|undefined|null) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: "Token generation failed" });
                }
                success = true;
                res.status(200).send({ success, message: "User logged in successfully", user, token });
            });
        } catch (error) {
            res.status(500).json({ error: "Server Error" });
        }
    }
}

export default UserController;
