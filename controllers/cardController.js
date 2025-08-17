import { CardsService } from "../services/cardService.js";
import { CardRepository } from "../repository/CardRepository.js";
import Either from "../utils/Either.js";
import game from "../models/games.js";

const cardRepository = new CardRepository();
const cardService = new CardsService(cardRepository);

export async function createCard(req, res, next) {
  const dataCard = req.body;
  if (validateInputCard(dataCard))
    return res.status(400).json({ message: "All fields must be completed" });

  const response = await cardService.createCard(dataCard);
  if (response.isRight()) {
    return res.status(201).json(response.value);
  } else {
    const err = response.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getAllCards(req, res, next) {
  const response = await cardService.getAllCards();
  if (response.isRight()) {
    return res.status(200).json(response.value);
  } else {
    const err = response.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getByIdCard(req, res, next) {
  const id = req.params.id;
  const cardFindById = await cardService.getByIdCard(id);
  if (cardFindById.isRight()) {
    return res.status(200).json(cardFindById.value);
  } else {
    const err = cardFindById.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function updateAllCard(req, res, next) {
  const dataNewCard = req.body;
  const id = req.params.id;
  if (validateInputCard(dataNewCard))
    return res.status(400).json({ message: "All fields must be completed" });
  const cardUpdated = await cardService.updateAll(dataNewCard, id);
  if (cardUpdated.isRight()) {
    return res.status(200).json(cardUpdated.value);
  } else {
    const err = cardUpdated.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function deleteById(req, res, next) {
  const id = req.params.id;
  const cardDeleted = await cardService.deleteById(id);
  if (cardDeleted.isRight()) {
    return res.status(204).send();
  } else {
    const err = cardDeleted.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function patchCard(req, res, next) {
  const newData = req.body;
  const id = req.params.id;
  const updatedCard = await cardService.patchCard(newData, id);
  if (updatedCard.isRight()) {
    return res.status(200).json(updatedCard.value);
  } else {
    const err = updatedCard.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getTopCard(req, res, next) {
  const { idGame } = req.body;
  if (!idGame) return res.status(400).json({ message: "Game ID is required" });
  const response = await cardService.getTopCard(idGame);
  if (response.isRight()) {
    return res.status(200).json(response.value);
  } else {
    const err = response.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

function validateInputCard(data) {
  return Object.values(data).some(
    (val) => val === null || val === undefined || val === ""
  );
}
