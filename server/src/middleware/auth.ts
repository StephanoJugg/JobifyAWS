import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors';

const auth = async (req: Request, res: Response, next: NextFunction) => {
   const authHeader = req.get('authorization');
   if(!authHeader || !authHeader.startsWith('Bearer')) {
       throw new UnauthenticatedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = verify(token, process.env.JWT_SECRET as string);
        req.user = payload;
        next();
    } catch (error) {
        throw new UnauthenticatedError('Invalid token');
    }
}

export default auth