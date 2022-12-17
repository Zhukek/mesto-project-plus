import { RequestCustom } from "../app";
import {Response, Request} from "express";
import Card from "../models/card";
import User from "../models/user";
import { NOT_FOUND_ERROR_STATUS, SERVER_ERROR_STATUS, WRONG_DATA_ERROR } from "../services/errors";

export const getCards = (req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => {res.send({cards: cards})})
    .catch(() => {
      res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так')
    })
}

export const createCard = (req: Request, res: Response) => {
  const id = (req as RequestCustom)?.user?._id;
  const { name, link } = req.body;

  return Card.create({name: name, link: link, owner: id})
    .then((card) => {
      if(!name || !link) {
        const error = new Error(WRONG_DATA_ERROR.message);
        error.name = WRONG_DATA_ERROR.name;
        throw error
      }
      res.send({card: card})
    })
    .catch((err) => {
      if (err.name === WRONG_DATA_ERROR.name) {
        res.status(WRONG_DATA_ERROR.status).send(err.message)
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так')
      }
    })
}

export const deleteCardById = (req: Request, res: Response) => {
  return Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(NOT_FOUND_ERROR_STATUS).send("Запрашиваемая карточка не найдена")
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так')
      }
    })
}

export const likeCard = (req: Request, res: Response) => {
  const id = (req as RequestCustom)?.user?._id;
  User.findById(id)
    .catch(() => {
      res.status(400).send('Передан неверный пользователь')
      return
    })

  return Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: { likes: id }
  }, {
    new: true
  })
    .then((card) => res.send({card: card}))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(NOT_FOUND_ERROR_STATUS).send("Запрашиваемая карточка не найдена")
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так')
      }
    })
}

export const removeLike = (req: Request, res: Response) => {
  const id = (req as RequestCustom)?.user?._id;
  User.findById(id)
    .catch(() => {
      res.status(400).send('Передан неверный пользователь')
      return
    })

  return Card.findByIdAndUpdate(req.params.cardId, {
    $pull: { likes: id }
  }, {
    new: true
  })
    .then((card) => res.send({card: card}))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(NOT_FOUND_ERROR_STATUS).send("Запрашиваемая карточка не найдена")
      } else {
        res.status(SERVER_ERROR_STATUS).send('Что-то пошло не так')
      }
    })
}
