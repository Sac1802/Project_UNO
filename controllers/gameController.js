import * as gameService from '../services/gameService.js'
import * as  createCardAuto from '../services/cardCreateAuto.js'

export async function createGame(req, res, next) {
    console.log('>>> Headers:', req.headers);
    console.log('>>> Body raw:', req.body);
    const dataGame = req.body;
    if(validateInputGame(dataGame)) return res.status(400).json({message : 'All fields must be completed'});
    try{
        const gameCreated = await gameService.createGame(dataGame);
        const idGame = gameCreated.id;
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

function validateInputGame(data){
    return Object.values(data).some(val => 
        val === null || val === undefined || val === '');
}