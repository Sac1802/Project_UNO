import {RulesService} from "../services/rulesServices.js";
import { GameRepository } from "../repository/gameRepository.js";
import { MatchRepository } from "../repository/matchRepository.js";
import { OrderGameRepository } from "../repository/OrderGameRepoository.js";
import { playerInGameRepository } from "../repository/playerInGameRepository.js";
import { CardRepository } from "../repository/CardRepository.js";
import { Either } from "../utils/either.js";

const repoGame = new GameRepository();
const repoMatch = new MatchRepository();
const repoOrder = new OrderGameRepository();
const repoPlayerInGame = new playerInGameRepository();
const repoCard = new CardRepository();

const rulesService = new RulesService(
    repoMatch,
    repoGame,
    repoOrder,
    repoPlayerInGame,
    repoCard
);


export async function nextTurn(req, res, next) {
    const {idGame} = req.params.idGame;
    const result = await rulesService.nextTurn(idGame);
    if(result.isRight()){
        res.status(200).json(result.right);
    }else{
        res.status(404).json({message:result.left.message});
    }
}

export async function skipPlayer(req, res, next) {
    const {idGame} = req.params.idGame;
    const {cardId} = req.params.cardId;
    const result = await rulesService.skipPlayer(idGame, cardId);
    if(result.isRight()){
        res.status(200).json(result.right);
    }else{
        res.status(404).json({message:result.left.message});
    }
}

export async function reverseOrder(req, res, next) {
    const {idGame} = req.params.idGame;
    const result = await rulesService.reverseOrder(idGame);
    if(result.isRight()){
        res.status(200).json(result.right);
    }else{
        res.status(404).json({message:result.left.message});
    }
}

export async function carPlay(req, res, next) {
    const {idGame} = req.params.idGame;
    const {playerId} = req.user.playerId;
    const result = await rulesService.carPlay(idGame, playerId);
    if(result.isRight()){
        res.status(200).json(result.right);
    }else{
        res.status(404).json({message:result.left.message});
    }
}