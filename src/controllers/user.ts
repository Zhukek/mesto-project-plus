import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RequestCustom } from '../services/types';
import User from '../models/user';
import { WrongDataError } from '../services/errors';
import keyString from '../services/keyString';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.send({ users }))
  .catch(next);

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;

  return User.findById(id)
    .then((user) => res.send({ user }))
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    password, email, name, about, avatar,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      if (!(password && email)) {
        throw new WrongDataError('Переданы не все данные');
      }
      return res.send({ user });
    })
    .catch(next);
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const id = (req as RequestCustom)?.user?._id;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!name || !about) {
        throw new WrongDataError('Переданы не все данные');
      }
      return res.send({ user });
    })
    .catch(next);
};

export const updateAvatar = (req: Request, res: Response, next: NextFunction) => {
  const id = (req as RequestCustom)?.user?._id;
  const { avatar } = req.body;

  return User.findByIdAndUpdate(id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!avatar) {
        throw new WrongDataError('Переданы не все данные');
      }
      return res.send({ user });
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { password, email } = req.body;

  return User.loginUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, keyString, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

export const getMe = (req: RequestCustom, res: Response, next: NextFunction) => {
  const id = req?.user?._id;

  return User.findById(id)
    .then((user) => res.send({ user }))
    .catch(next);
};
