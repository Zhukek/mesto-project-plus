import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { keyString } from "../services/constants";
import { RequestCustom } from '../services/types';

const authMiddleware = (req: RequestCustom, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send('Auth error')
  }

  const token = authorization.replace('Bearer ','');
  let payload:string | jwt.JwtPayload;

  try {
    payload = jwt.verify(token, keyString)
  } catch (error) {
    return res.status(401).send('Auth error')
  }

  req.user === payload
}

export default authMiddleware
