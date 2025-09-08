import { GameCreationService } from "../services/gameServices/gameCreationService.js";
import { GameStatusService } from "../services/gameServices/gameStatusService.js";
import { GameGetService } from "../services/gameServices/gameGetService.js";
import { GameUpdateService } from "../services/gameServices/gameUpdateService.js";
import { MatchService } from "../services/matchService.js";
import * as matchController from "./matchController.js";
import { GameRepository } from "../repository/gameRepository.js";
import { CardRepository } from "../repository/CardRepository.js";
import { CardCreateAuto } from "../services/cardCreateAuto.js";
import { OrderGameRepository } from "../repository/OrderGameRepoository.js";
import { MatchRepository } from "../repository/matchRepository.js";

const gameRepository = new GameRepository();
const cardRepository = new CardRepository();
const orderGameRepository = new OrderGameRepository();
const matchRepository = new MatchRepository();
const gameCreateService = new GameCreationService(gameRepository);
const gameGetService = new GameGetService(gameRepository);
const gameUpdateService = new GameUpdateService(gameRepository);
const gameStatusService = new GameStatusService(gameRepository);
const createCardAuto = new CardCreateAuto(cardRepository);

export async function createGame(req, res, next) {
  const dataGame = req.body;
  const user = req.user.playerId;
  if (validateInputGame(dataGame))
    return res.status(400).json({ message: "All fields must be completed" });
  const response = await gameCreateService.createGame(dataGame, user);
  if (response.isRight()) {
    const gameCreated = response.right;
    await createCardAuto.saveCardsAuto(gameCreated.game_id);
    await orderGameRepository.saveOrderGame(gameCreated.game_id, "clockwise");
    await matchRepository.saveUserMatch({
      id_game: gameCreated.game_id,
      id_player: user,
      status: "wait",
    });
    return res.status(201).json(gameCreated);
  } else {
    const err = response.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getAllGames(req, res, next) {
  const response = await gameGetService.getAllGames();
  if (response.isRight()) {
    const gamesFindAll = response.right;
    return res.status(200).json(gamesFindAll);
  } else {
    const err = response.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getById(req, res, next) {
  const id = req.params.id;
  const gameFindById = await gameGetService.getById(id);
  if (gameFindById.isRight()) {
    return res.status(200).json(gameFindById.right);
  } else {
    const err = gameFindById.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function updateAllGame(req, res, next) {
  const dataNewGame = req.body;
  const id = req.params.id;
  if (validateInputGame(dataNewGame))
    return res.status(400).json({ message: "All fields must be completed" });
  const gameUpdated = await gameUpdateService.updateAllGame(dataNewGame, id);
  if (gameUpdated.isRight()) {
    return res.status(200).json(gameUpdated.right);
  } else {
    const err = gameUpdated.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function deleteById(req, res, next) {
  const id = req.params.id;
  const response = await gameUpdateService.deleteById(id);
  if (response.isRight()) {
    return res.status(204).send();
  } else {
    const err = response.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function patchGame(req, res, next) {
  const newData = req.body;
  const id = req.params.id;
  const updatedGames = await gameUpdateService.patchGame(newData, id);
  if (updatedGames.isRight()) {
    return res.status(200).json(updatedGames.right);
  } else {
    const err = updatedGames.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function startGame(req, res, next) {
  const dataUser = req.user.playerId;
  const { idGame } = req.body;
  if (!idGame) return res.status(400).json({ message: "Game ID is required" });
  const response = await gameStatusService.startGame(idGame, dataUser);
  if (response.isRight()) {
    await matchController.startGameController(idGame,dataUser, next);
    return res.status(200).json(response);
  } else {
    const err = response.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function endGame(req, res, next) {
  const dataUser = req.user.playerId;
  const { idGame } = req.body;
  if (!idGame) return res.status(400).json({ message: "Game ID is required" });
  const response = await gameStatusService.endGame(idGame, dataUser);
  if (response.isRight()) {
    matchController.endedGame(idGame, dataUser, next);
    return res.status(200).json(response);
  } else {
    const err = response.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getStatusGame(req, res, next) {
  const { idGame } = req.body;
  if (!idGame) return res.status(400).json({ message: "Game ID is required" });
  const response = await gameStatusService.getStatusGame(idGame);
  if (response.isRight()) {
    return res.status(200).json(response);
  } else {
    const err = response.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function currentPlayer(req, res, next) {
  const { idGame } = req.body;
  if (!idGame) return res.status(400).json({ message: "Game ID is required" });
  const response = await gameGetService.getCurrentPlayer(idGame);
  if (response.isRight()) {
    return res.status(200).json(response);
  } else {
    const err = response.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function createGameFast(req, res, next) {
  const dataGame = req.body;
  const user = req.user.playerId;
  if (validateInputGame(dataGame))
    return res.status(400).json({ message: "All fields must be completed" });

  const gameCreated = await gameCreateService.gameFast(dataGame, user);
  if (gameCreated.isRight()) {
    const idGame = gameCreated.game_id;
    await createCardAuto.saveCardsAuto(idGame);
    return res.status(201).json(gameCreated);
  } else {
    const err = gameCreated.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function createGameWithLimit(req, res, next) {
  const dataGame = req.body;
  const user = req.user.playerId;
  if (validateInputGame(dataGame))
    return res.status(400).json({ message: "All fields must be completed" });
  const gameCreated = await gameCreateService.gameWithLimit(
    dataGame,
    user,
    dataGame.limitTime
  );
  const idGame = gameCreated.game_id;
  await createCardAuto.saveCardsAuto(idGame);
  if (gameCreated.isRight()) {
    return res.status(201).json(gameCreated);
  } else {
    const err = gameCreated.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

function validateInputGame(data) {
  return Object.values(data).some(
    (val) => val === null || val === undefined || val === ""
  );
}
