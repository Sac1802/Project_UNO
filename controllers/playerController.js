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

function validateInputPlayer(data){
    return Object.values(data).some(val => 
        val === null || val === undefined || val === '');
}