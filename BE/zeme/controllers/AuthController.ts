import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import axios from 'axios';

class AuthController {

  static async googleLogin(req: Request, res: Response) {
    try {
      const { code } = req.body;

      if (!code) {
        return res.status(400).json({
          success: false,
          error: 'Authorization code is required'
        });
      }

      // Exchange the authorization code for tokens
      const tokenUrl = 'https://oauth2.googleapis.com/token';
      const tokenData = {
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`,
        grant_type: 'authorization_code'
      };
      
      const tokenResponse = await axios.post(tokenUrl, 
        new URLSearchParams(tokenData).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token } = tokenResponse.data;

      // Get user info from Google
      const userResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      const payload = userResponse.data;

      // Check if user exists
      let user = await User.findOne({ email: payload.email });

      if (!user) {
        // Create new user with required phone field and other Google data
        user = await User.create({
          email: payload.email,
          firstName: payload.given_name || '',
          lastName: payload.family_name || '',
          googleId: payload.sub,
          role: 'user',
          phone: 'Not provided', // Add a default value for phone
          password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10) // Generate a random password
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user?._id },
        process.env.JWT_SECRET || 'mysecret@key',
        { expiresIn: '24h' }
      );

      // Return success response
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Google login error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to authenticate with Google',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default AuthController; 