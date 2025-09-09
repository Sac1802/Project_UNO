import { MatchService } from "../services/matchService.js";
import { MatchRepository } from "../repository/matchRepository.js";
import { GameRepository } from "../repository/gameRepository.js";

const matchRepository = new MatchRepository();
const gameRepository = new GameRepository();
const matchService = new MatchService(matchRepository, gameRepository);

export async function saveMatch(req, res, next) {
  const dataUser = req.user.playerId;
  const { idGame } = req.body;

  if (!idGame) {
    return res.status(400).json({ message: "Game ID is required" });
  }

  const result = await matchService.saveUserMatch(idGame, dataUser);

  if (result.isRight()) {
    return res.status(201).json(result);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function changeStatusUser(req, res, next) {
  const dataUser = req.user.playerId;
  const { idGame } = req.body;

  if (!idGame) {
    return res.status(400).json({ message: "Game ID is required" });
  }

  const result = await matchService.changeStatus(idGame, dataUser);

  if (result.isRight()) {
    return res.status(200).json(result);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function startGame(idGame, res, dataUser, next) {
  if (!idGame) {
    return res.status(400).json({ message: "Game ID is required" });
  }

  const result = await matchService.changeStatusInGame(idGame, dataUser);

  if (result.isRight()) {
    return res.status(200).json(result);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function startGameController(idGame, dataUser, next) {
  if (!idGame) {
    return res.status(400).json({ message: "Game ID is required" });
  }

  const result = await matchService.changeStatusInGame(idGame, dataUser);

  if (result.isRight()) {
    return result;
  } else {
    const err = result.getError();
    return { error: err.message, statusCode: err.statusCode || 500 };
  }
}

export async function abandonmentGame(req, res, next) {
  const dataUser = req.user.playerId;
  const { idGame } = req.body;

  if (!idGame) {
    return res.status(400).json({ message: "Game ID is required" });
  }

  const result = await matchService.abandonmentGame(idGame, dataUser);

  if (result.isRight()) {
    return res.status(200).json(result);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function endedGame(idGame, dataUser) {
  if (!idGame)
    return Either.left({ message: "Game ID is required", statusCode: 400 });

  const result = await matchService.endGame(idGame, dataUser);
  return result; 
}

export async function getPlayerInGame(req, res, next) {
  const { idGame } = req.body;

  if (!idGame) {
    return res.status(400).json({ message: "Game ID is required" });
  }

  const result = await matchService.getPlayers(idGame);

  if (result.isRight()) {
    return res.status(200).json(result);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}
