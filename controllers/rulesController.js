import {RulesService} from "../services/rulesServices.js";
import { GameRepository } from "../repository/gameRepository.js";
import { MatchRepository } from "../repository/matchRepository.js";
import { OrderGameRepository } from "../repository/OrderGameRepoository.js";
import { playerInGameRepository } from "../repository/playerInGameRepository.js";
import { CardRepository } from "../repository/CardRepository.js";
import  Either  from "../utils/Either.js";

const repoGame = new GameRepository();
const repoMatch = new MatchRepository();
const repoOrder = new OrderGameRepository();
const repoPlayerInGame = new playerInGameRepository();
const repoCard = new CardRepository();

export const rulesService = new RulesService(
    repoMatch,
    repoGame,
    repoOrder,
    repoPlayerInGame,
    repoCard
);


export async function nextTurn(req, res, next) {
    const idGame = req.body.idGame;
    const result = await rulesService.nextTurn(idGame);
    if(result.isRight()){
        res.status(200).json(result.right);
    }else{
        res.status(404).json({message:result.left.message});
    }
}

export async function skipPlayer(req, res, next) {
    const idGame = req.body.idGame;
    const cardId = req.body.cardId;
    const result = await rulesService.skipPlayer(idGame, cardId);
    if(result.isRight()){
        res.status(200).json(result.right);
    }else{
        res.status(404).json({message:result.left.message});
    }
}

export async function reverseOrder(req, res, next) {
    const idGame = req.body.idGame;
    const result = await rulesService.reverseOrder(idGame);

    if(result.isRight()){
        res.status(200).json(result.right);
    }else{
        res.status(404).json({message:result.left.message});
    }
}
