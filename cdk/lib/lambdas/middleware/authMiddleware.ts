import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { APIGatewayProxyEvent } from 'aws-lambda';

const userPoolId = 'eu-central-1_kU37rZIY8';
const userPoolWebClientId = '2immfs5p4tuj6v55i0eodr9tdg';

export const authMiddleware = async (
  event: APIGatewayProxyEvent,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      return res.status(401).json({ message: 'Token error' });
    }

    const [, token] = parts;

    const verifyToken = (token: string, secret: string) => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err: any, decoded: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      });
    };

    const decoded = await verifyToken(token, userPoolWebClientId);
    req.user = decoded;
    console.log(req.user);
    return next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
