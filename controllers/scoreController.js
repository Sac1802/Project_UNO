import * as scoreService from '../services/scoreService.js'


export async function saveScore(req, res, next){
    const data = req.body;
    if(validateInputScore(data)) return res.status(400).json({message : 'All fields must be completed'});
    try{
        const scoreSaved = await scoreService.saveScore(data);
        return res.status(201).json(scoreSaved);
    }catch(error){
        next(error);
    }
}

export async function getAllScore(req, res, next) {
    try{
        const getScore = await scoreService.getAllScore();
        return res.status(200).json(getScore);
    }catch(error){
        next(error);
    }
}

export async function getById(req, res, next){
    const id = req.params.id;
    try{
        const getByIdScore = await scoreService.getById(id);
        return res.status(200).json(getByIdScore);
    }catch(error){
        next(error);
    }
}

export async function updateAllScore(req, res, next){
    const dataUpdated =  req.body;
    if(validateInputScore(dataUpdated)) return res.status(400).json({message : 'All fields must be completed'});
    const id = req.params.id;
    try{
        const scoreUpdated = await scoreService.updateAll(dataUpdated, id);
        return res.status(200).json(scoreUpdated);
    }catch(error){
        next(error);
    }
}

export async function deleteById(req, res, next){
    const id = req.params.id;
    try{
        await scoreService.deleteById(id);
        return res.status(204).send();
    }catch(error){
        next(error);
    }
}

export async function patchScore(req, res, next){
    const newData = req.body;
    const id =  req.params.id;
    try{
        const newScoreUpdated = await scoreService.patchScore(newData, id);
        return res.status(200).json(newScoreUpdated);
    }catch(error){
        next(error);
    }
}

export async function getScoreAllPlayer(req, res, next){
    const { idGame } = req.body;
    if (!idGame) return res.status(400).json({ message: "Game ID is required" });
    try{
        const response = await scoreService.scoreAllPlayers(idGame);
        return res.status(200).json(response);
    }catch(error){
        next(error);
    }
}

function validateInputScore(data){
    return Object.values(data).some(val => 
        val  === null || val === undefined || val  === '');
}