import * as gameService from '../services/gameService.js';
import * as  createCardAuto from '../services/cardCreateAuto.js';
import * as matchController from './matchController.js';

export async function createGame(req, res, next) {
    const dataGame = req.body;
    const user = req.user.playerId;
    if(validateInputGame(dataGame)) return res.status(400).json({message : 'All fields must be completed'});
    try{
        const gameCreated = await gameService.createGame(dataGame, user);
        const idGame = gameCreated.game_id;
        await createCardAuto.saveCardsAuto(idGame);
        return res.status(201).json(gameCreated);
    }catch(error){
        next(error);
    }
}

export async function getAllGames(req,  res, next){
    try{
        const gamesFindAll =  await gameService.getAllGames();
        return res.status(200).json(gamesFindAll);
    }catch(error){
        next(error);
    }
}

export async function getById(req, res, next) {
    const id = req.params.id;
    try{
        const gameFindById = await gameService.getById(id);
        return res.status(200).json(gameFindById);
    }catch(error){
        next(error);
    }
}

export async function updateAllGame(req, res, next){
    const dataNewGame = req.body;
    const id = req.params.id;
    if(validateInputGame(dataNewGame)) return res.status(400).json({message : 'All fields must be completed'});
    try{
        const gameUpdated = await gameService.updateAllGame(dataNewGame, id);
        return res.status(200).json(gameUpdated);
    }catch(error){
        next(error);
    }
}

export async function deleteById(req, res, next) {
    const id = req.params.id;
    try{
        await gameService.deleteById(id);
        return res.status(204).send();
    }catch(error){
        next(error);
    }
}


export async function patchGame(req, res, next){
    const newData =  req.body;
    const id = req.params.id;
    try{
        const updatedGames = await gameService.patchGame(newData,  id);
        return res.status(200).json(updatedGames);
    }catch(error){
        next(error);
    }
}

export async function startGame(req, res, next) {
    const dataUser = req.user.playerId;
    const { idGame } = req.body;
    if (!idGame) return res.status(400).json({ message: "Game ID is required" });
    try{
        const response = await gameService.startGame(idGame, dataUser);
        matchController.startGame(idGame, dataUser, next);
        return res.status(200).json(response);
    }catch(error){
        next(error);
    }
}

export async function endGame(req, res, next) {
    const dataUser = req.user.playerId;
    const { idGame } = req.body;
    if (!idGame) return res.status(400).json({ message: "Game ID is required" });
    try{
        const response = await gameService.endGame(idGame, dataUser);
        matchController.endedGame(idGame, dataUser, next);
        return res.status(200).json(response);
    }catch(error){
        next(error);
    }
}

export async function getStatusGame(req, res, next) {
    const { idGame } = req.body;
    if(!idGame) return res.status(400).json({ message: "Game ID is required" });
    try{
        const response = await gameService.getStatusGame(idGame);
        return res.status(200).json(response);
    }catch(error){
        next(error);
    }
}

export async function currentPlayer(req, res, next) {
    const { idGame } = req.body;
    if(!idGame) return res.status(400).json({ message: "Game ID is required" });
    try{
        console.log(idGame);
        const response = await gameService.getCurrentPlayer(idGame);
        return res.status(200).json(response);
    }catch(error){
        next(error);
    }
}

function validateInputGame(data){
    return Object.values(data).some(val => 
        val === null || val === undefined || val === '');
}