import { CardsService } from "../services/cardService.js";
import { CardRepository } from "../repository/CardRepository.js";

function getCardService() {
  const cardRepository = new CardRepository();
  return new CardsService(cardRepository);
}

export async function createCard(req, res, next) {
  const dataCard = req.body;
  if (validateInputCard(dataCard))
    return res.status(400).json({ message: "All fields must be completed" });

  const response = await getCardService().createCard(dataCard);
  if (!response.isLeft()) {
    return res.status(201).json(response.right);
  } else {
    const err = response.getError();
    return res.status(err?.statusCode || 500).json({ error: err?.message });
  }
}

export async function getAllCards(req, res, next) {
  const response = await getCardService().getAllCards();
  if (!response.isLeft()) {
    return res.status(200).json(response.right);
  } else {
    const err = response.getError();
    return res.status(err?.statusCode || 500).json({ error: err?.message });
  }
}

export async function getByIdCard(req, res, next) {
  const id = req.params.id;
  const cardFindById = await getCardService().getByIdCard(id);
  if (!cardFindById.isLeft()) {
    return res.status(200).json(cardFindById.right);
  } else {
    const err = cardFindById.getError();
    return res.status(err?.statusCode || 500).json({ error: err?.message });
  }
}

export async function updateAllCard(req, res, next) {
  const dataNewCard = req.body;
  const id = req.params.id;
  if (validateInputCard(dataNewCard))
    return res.status(400).json({ message: "All fields must be completed" });
  const cardUpdated = await getCardService().updateAll(dataNewCard, id);
  if (!cardUpdated.isLeft()) {
    return res.status(200).json(cardUpdated.right);
  } else {
    const err = cardUpdated.getError();
    return res.status(err?.statusCode || 500).json({ error: err?.message });
  }
}

export async function deleteById(req, res, next) {
  const id = req.params.id;
  const cardDeleted = await getCardService().deleteById(id);
  if (!cardDeleted.isLeft()) {
    return res.status(204).send();
  } else {
    const err = cardDeleted.getError();
    return res.status(err?.statusCode || 500).json({ error: err?.message });
  }
}

export async function patchCard(req, res, next) {
  const newData = req.body;
  const id = req.params.id;
  const updatedCard = await getCardService().patchCard(newData, id);
  if (!updatedCard.isLeft()) {
    return res.status(200).json(updatedCard.right);
  } else {
    const err = updatedCard.getError();
    return res.status(err?.statusCode || 500).json({ error: err?.message });
  }
}

export async function getTopCard(req, res, next) {
  const { idGame } = req.body;
  if (!idGame) return res.status(400).json({ message: "Game ID is required" });
  const response = await getCardService().getTopCard(idGame);
  if (!response.isLeft()) {
    return res.status(200).json(response.right);
  } else {
    const err = response.getError();
    return res.status(err?.statusCode || 500).json({ error: err?.message });
  }
}

function validateInputCard(data) {
  return Object.values(data).some(
    (val) => val === null || val === undefined || val === ""
  );
}
