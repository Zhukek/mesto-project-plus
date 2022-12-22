import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthError } from '../services/errors';
import keyString from '../services/keyString';
import { RequestCustom } from '../services/types';

const authMiddleware = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Требуется авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload: jwt.JwtPayload;

  try {
    payload = (jwt.verify(token, keyString)) as jwt.JwtPayload;
  } catch (error) {
    throw new AuthError('Требуется авторизация');
  }

  req.user = { _id: payload._id };
  next();
};

export default authMiddleware;
