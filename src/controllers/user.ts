import { Request, Response } from 'express';
import { RequestCustom } from '../services/types';
import User from '../models/user';
import { SERVER_ERROR_STATUS, WRONG_DATA_ERROR } from '../services/errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { keyString } from '../services/constants';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.send({ users }))
  .catch(() => {
    res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так');
  });

export const getUserById = (req: Request, res: Response) => User.findById(req.params.userId)
  .then((user) => res.send({ user }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(WRONG_DATA_ERROR.status).send('Запрашиваемый пользователь не найден');
    } else {
      res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так');
    }
  });

export const createUser = (req: Request, res: Response) => {
  const { password, email, name, about, avatar } = req.body;

  return bcrypt.hash(password, 10)
    .then(hash => User.create({name, about, avatar, email, password: hash}))
    .then((user) => {
      if (!(password && email)) {
        const error = new Error(WRONG_DATA_ERROR.message);
        error.name = WRONG_DATA_ERROR.name;
        throw error;
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === WRONG_DATA_ERROR.name || err.name === 'ValidationError') {
        res.status(WRONG_DATA_ERROR.status).send(err.message);
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так');
      }
    });
};

export const updateUser = (req: Request, res: Response) => {
  const id = (req as RequestCustom)?.user?._id;
  const { name, about } = req.body;

  return User.findByIdAndUpdate(id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!name || !about) {
        const error = new Error(WRONG_DATA_ERROR.message);
        error.name = WRONG_DATA_ERROR.name;
        throw error;
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === WRONG_DATA_ERROR.name || err.name === 'ValidationError') {
        res.status(WRONG_DATA_ERROR.status).send(err.message);
      } else if (err.name === 'CastError') {
        res.status(WRONG_DATA_ERROR.status).send('Запрашиваемый пользователь не найден');
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так');
      }
    });
};

export const updateAvatar = (req: Request, res: Response) => {
  const id = (req as RequestCustom)?.user?._id;
  const { avatar } = req.body;

  return User.findByIdAndUpdate(id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!avatar) {
        const error = new Error(WRONG_DATA_ERROR.message);
        error.name = WRONG_DATA_ERROR.name;
        throw error;
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === WRONG_DATA_ERROR.name || err.name === 'ValidationError') {
        res.status(WRONG_DATA_ERROR.status).send(err.message);
      } else if (err.name === 'CastError') {
        res.status(WRONG_DATA_ERROR.status).send('Запрашиваемый пользователь не найден');
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так');
      }
    });
};

export const login = (req: Request, res: Response) => {
  const {password, email} = req.body;


  return User.loginUser(email, password)
    .then((user) => {

      const token = jwt.sign({ _id: user._id }, keyString, {expiresIn: '7d'});
      res.send({token: token});
    })
    .catch((err) => {
      if (err.name === "WrongUserOrPass") {
        res.status(401).send(err.message);
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так');
      }
    });
}
