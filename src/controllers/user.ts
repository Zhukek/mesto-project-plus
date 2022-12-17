import { RequestCustom } from "../app";
import { Request, Response } from "express";
import User from "../models/user";
import { NOT_FOUND_ERROR_STATUS, SERVER_ERROR_STATUS, WRONG_DATA_ERROR } from "../services/errors";

export const getUsers = (req: Request, res: Response) => {
  return User.find({})
    .then((users) => res.send({users: users}))
    .catch((err) => {
      res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так')
    })
}

export const getUserById = (req: Request, res: Response) => {
  return User.findById(req.params.userId)
    .then((user) => res.send({user: user}))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(NOT_FOUND_ERROR_STATUS).send("Запрашиваемый пользователь не найден")
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так')
      }
    })
}

export const createUser = (req: Request, res: Response) => {
  const {name, about, avatar} = req.body;

  return User.create({name: name, about: about, avatar: avatar})
    .then((user) => {
      if(!name || !about || !avatar) {
        const error = new Error(WRONG_DATA_ERROR.message);
        error.name = WRONG_DATA_ERROR.name;
        throw error
      }
      return res.send({user: user})
    })
    .catch((err) => {
      if (err.name === WRONG_DATA_ERROR.name) {
        res.status(WRONG_DATA_ERROR.status).send(err.message)
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так')
      }
    })
}

export const updateUser = (req: Request, res: Response) => {
  const id = (req as RequestCustom)?.user?._id;
  const {name, about} = req.body;

  return User.findByIdAndUpdate(id, {name: name, about: about}, {
      new: true
  })
    .then((user) => {
      if(!name || !about) {
        const error = new Error(WRONG_DATA_ERROR.message);
        error.name = WRONG_DATA_ERROR.name;
        throw error
      }
      return res.send({user: user})
    })
    .catch((err) => {
      if (err.name === WRONG_DATA_ERROR.name) {
        res.status(WRONG_DATA_ERROR.status).send(err.message)
      } else if (err.name === "CastError") {
        res.status(NOT_FOUND_ERROR_STATUS).send("Запрашиваемый пользователь не найден")
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так')
      }
    })
}

export const updateAvatar = (req: Request, res: Response) => {
  const id = (req as RequestCustom)?.user?._id;
  const {avatar} = req.body;

  return User.findByIdAndUpdate(id, {avatar: avatar}, {
      new: true,
  })
    .then((user) => {
      if(!avatar) {
        const error = new Error(WRONG_DATA_ERROR.message);
        error.name = WRONG_DATA_ERROR.name;
        throw error
      }
      return res.send({user: user})
    })
    .catch((err) => {
      if (err.name === WRONG_DATA_ERROR.name) {
        res.status(WRONG_DATA_ERROR.status).send(err.message)
      } else if (err.name === "CastError") {
        res.status(NOT_FOUND_ERROR_STATUS).send("Запрашиваемый пользователь не найден")
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так')
      }
    })
}
