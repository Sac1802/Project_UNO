import * as matchService from '../services/matchService.js'

export async function saveMatch(req, res, next) {
    const dataUser = req.user.playerId;
    const { idGame } = req.body;
    
    if (!idGame) return res.status(400).json({ message: "Game ID is required" });

    try{
        const response  = await matchService.saveUserMatch(idGame, dataUser);
        return res.status(200).json(response);
    }catch(error){
        next(error);
    }
}

export async function changeStatusUser(req, res, next){
    const dataUser = req.user.playerId;
    const { idGame } = req.body;
    if (!idGame) return res.status(400).json({ message: "Game ID is required" });
    try{
        const response = await matchService.changeStatus(idGame, dataUser);
        return res.status(200).json(response);
    }catch(error){
        next(error);
    }
}

export async function startGame(idGame, dataUser, next){
    if (!idGame) return res.status(400).json({ message: "Game ID is required" });
    try{
        await matchService.changeStatusInGame(idGame, dataUser);
    }catch(error){
        next(error);
    }
}

export async function abandonmentGame(req, res, next){
    const dataUser = req.user.playerId;
    const { idGame } = req.body;
    if (!idGame) return res.status(400).json({ message: "Game ID is required" });
    try{
        const response = await matchService.abandonmentGame(idGame, dataUser);
        return res.status(200).json(response);
    }catch(error){
        next(error);
    }
}

export async function endedGame(idGame, dataUser, next){
    if (!idGame) return res.status(400).json({ message: "Game ID is required" });
    try{
        await matchService.endGame(idGame, dataUser);
    }catch(error){
        next(error);
    }
}

export async function getPlayerInGame(req, res, next) {
    const { idGame } = req.body;
    if (!idGame) return res.status(400).json({ message: "Game ID is required" });
    try{
        const result = await matchService.getPlayers(idGame);
        return res.status(200).json(result);
    }catch(error){
        next(error);
    }
    
}