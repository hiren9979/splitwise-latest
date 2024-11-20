import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../model/customRequest';

const SECRET_KEY = process.env.PRIVATE_KEY;

export async function authMiddleware(req: CustomRequest, res: Response, next: NextFunction): Promise<any> {
    const authToken = req.headers.authorization;
    
    if (!authToken) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }
    if (!SECRET_KEY) {
        throw new Error('JWT_SECRET environment variable is not defined');
    }
    const decoded = jwt.decode(authToken.split(' ')[1]) as any;
    console.log(decoded);

    jwt.verify(authToken.split(' ')[1], SECRET_KEY, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

export default authMiddleware;
