import { createCard, deleteCardById, removeLike, getCards, likeCard } from "../controllers/cards";
import { Router } from "express";

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', removeLike);

export default router;
