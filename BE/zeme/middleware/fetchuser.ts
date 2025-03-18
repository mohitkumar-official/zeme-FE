import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: { id: string };
}

const fetchuser = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.header('auth-token');
    if (!token) {
        // res.status(401).send({ error: "Please authenticate using a valid token" });
        throw new Error("Please authenticate using a valid token");
    }

    try {
        const data = jwt.verify(token, "mysecret@key") as jwt.JwtPayload; // Use jwt.JwtPayload to type the decoded data
        req.user = { id: data.id }; // Safely assign the `id` from the decoded token
        next();
    } catch (error) {
         res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

export default fetchuser;
