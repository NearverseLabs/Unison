import { Response, NextFunction } from 'express';
import HttpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Payload, Request } from '../types';
import User from '../models/Users';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: 'No token, authorization denied' });
  }
  // Verify token
  try {
    const payload: Payload | any = jwt.verify(token, process.env.JWTSECRET);
    req.userId = payload.userId;
    req.id = payload.id;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json('user is not exists');
    }
    req.user = user;
    next();
  } catch (err) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: 'Token is not valid' });
  }
}
