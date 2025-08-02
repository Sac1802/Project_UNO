import * as playerService from '../services/playerService.js'

export async function createPlayet(req, res, next){
    const playerData = req.body;
    if(validateInputPlayer(playerData)) return res.status(400).json({error: 'All fields must be completed'});
    try{
        const playerCreated = await playerService.savePlayer(playerData);
        return res.status(201).json(playerCreated);
    }catch(error){
        next(error);
    }
}

export async function getPlayers(req, res, next){
    try{
        const getPlayers = await playerService.getPlayers();
        return res.status(200).json(getPlayers);
    }catch(error){
        next(error);
    }
}

export async function getByIdPlayer(req, res, next){
    try{
        const id = req.params.id;
        const getPlayerById = await playerService.getByIdPlayer(id);
        return res.status(200).json(getPlayerById);
    }catch(error){
        next(error);
    }
}

export async function updateFullPlayer(req, res, next){
    const dataUpdate = req.body;
    const id = req.params.id;
    if(validateInputPlayer(dataUpdate)) res.status(400).json({error: 'All fields must be completed'});
    try{
        const playerUpdated = await playerService.updateFullPlayer(dataUpdate, id)
        return res.status(200).json(playerUpdated);
    }catch(error){
        next(error);
    }
}

export async function deletePlayer(req, res, next){
    const id = req.params.id;
    try{
        await playerService.deletePlayer(id);
        res.status(204).send();
    }catch(error){
        next(error);
    }
}


export async function patchPlayer(req, res, next){
    const dataPlayerUpdate = req.body;
    const id = req.params.id;
    try{
        const playerUpdatedPartial = await playerService.patchPlayer(dataPlayerUpdate, id);
        return res.status(200).json(playerUpdatedPartial);
    }catch(error){
        next(error);
    }
}

export async function getPlayerByToken(req, res, next){
    const idPlayer = req.user.playerId;
    console.log('the player id is: ', idPlayer);
    if(!idPlayer) return res.status(400).json({ message: "Player ID is required" });
    try{
        const player = await playerService.getByIdByToken(idPlayer);
        return res.status(200).json(player);
    }catch(error){
        next(error);
    }
}

function validateInputPlayer(data){
    return Object.values(data).some(val => 
        val === null || val === undefined || val === '');
}