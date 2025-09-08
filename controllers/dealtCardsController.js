import { PlayCarService } from "../services/dealtCardsService.js";
import { GameRepository } from "../repository/gameRepository.js";
import { MatchRepository } from "../repository/matchRepository.js";
import { CardRepository } from "../repository/CardRepository.js";
import { PlayerRepository } from "../repository/playerRepository.js";
import { playerInGameRepository } from "../repository/playerInGameRepository.js";
import { TurnHistoryRepository } from "../repository/turnHistoryRepository.js";
import { OrderGameRepository } from "../repository/OrderGameRepoository.js";

const repoGame = new GameRepository();
const repoMacher = new MatchRepository();
const repoCards = new CardRepository();
const repoPlayer = new PlayerRepository();
const repoCardsPlayer = new playerInGameRepository();
const repoTurnHis = new TurnHistoryRepository();
const repoOrder = new OrderGameRepository();
const playCardService = new PlayCarService(
  repoGame,
  repoMacher,
  repoCards,
  repoPlayer,
  repoCardsPlayer,
  repoTurnHis,
  repoOrder
);

export async function dealtCards(req, res, next) {
    const idGame = req.body.idGame;
    const numberPlayers = req.body.maxCardsPerPlayer;
    const respoonse = await playCardService.dealtCard(idGame, numberPlayers);
    if(respoonse.isRight()){
        return res.status(200).json(respoonse.right);
    }else{
        const err = respoonse.left;
        return res.status(err.statusCode || 500).json({ error: err.message });
    }
}

export async function playCard(req, res, next) {
    const idPlayer = req.user.playerId;
    const cardId = req.body.cardId;
    const idGame = req.body.idGame;
    const response = await playCardService.playCard(idPlayer, cardId, idGame);
    if (response.isRight()) {
        return res.status(200).json(response.right);
    } else {
        const err = response.left;
        return res.status(err.statusCode || 500).json({ error: err.message });
    }
}

export async function drawCard(req, res, next) {
    const idPlayer = req.user.playerId;
    const idGame = req.body.idGame;
    const response = await playCardService.drawCard(idPlayer, idGame);
    if (response.isRight()) {
        return res.status(200).json(response.right);
    } else {
        const err = response.getError();
        return res.status(err.statusCode || 500).json({ error: err.message });
    }
}

export async function sayUno(req, res, next) {
    const idPlayer = req.user.playerId;
    const idGame = req.body.idGame;
    const response = await playCardService.sayUno(idPlayer, idGame);
    if (response.isRight()) {
        return res.status(200).json(response.right);
    } else {
        const err = response.getError();
        return res.status(err.statusCode || 500).json({ error: err.message });
    }
}

export async function challengerSayUno(req, res, next) {
    const idPlayerChallenger = req.user.playerId;
    const idPlayerDefender = req.body.idPlayerDefender;
    const idGame = req.body.idGame;
    const response = await playCardService.challengerSayUno(idPlayerChallenger, idPlayerDefender, idGame);
    if (response.isRight()) {
        return res.status(200).json(response.right);
    } else {
        const err = response.getError();
        return res.status(err.statusCode || 500).json({ error: err.message });
    }
}

export async function finishGame(req, res, next) {
    const idGame = req.body.idGame;
    const response = await playCardService.finishGame(idGame);
    if (response.isRight()) {
        return res.status(200).json(response.right);
    } else {
        const err = response.getError();
        return res.status(err.statusCode || 500).json({ error: err.message });
    }
}

export async function getStatusGame(req, res, next) {
    const idGame = req.body.idGame;
    const response = await playCardService.getGameStatus(idGame);
    if (response.isRight()) {
        return res.status(200).json(response.right);
    } else {
        const err = response.getError();
        return res.status(err.statusCode || 500).json({ error: err.message });
    }
}

export async function getPlayerCards(req, res, next) {
    const idPlayer = req.user.playerId;
    const idGame = req.body.idGame;
    const response = await playCardService.getCardsPlayer(idGame, idPlayer);
    if (response.isRight()) {
        return res.status(200).json(response.right);
    } else {
        const err = response.getError();
        return res.status(err.statusCode || 500).json({ error: err.message });
    }
}

export async function getHistoryTurns(req, res, next) {
    const idGame = req.body.idGame;
    const response = await playCardService.getHistory(idGame);
    if (response.isRight()) {
        return res.status(200).json(response.right);
    } else {
        const err = response.getError();
        return res.status(err.statusCode || 500).json({ error: err.message });
    }
}