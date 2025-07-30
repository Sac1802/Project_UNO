import game from "../models/games.js";

export async function createGame(dataGame) {
    try{
        const createdGame = await game.create(dataGame);
        return createdGame;
    }catch(error){
        throw new Error(`Error creating game: ${error.message}`);
    }
}

export async function getAllGames(){
    try{
        const getAllGames = await game.findAll();
        return getAllGames;
    }catch(error){
        throw new Error(`Error game cannot be obtained: ${error.message}`);
    }
}

export async function getById(id) {
    try{
        const getGameById = await game.findByPk(id);
        return getGameById;
    }catch(error){
        throw new Error(`The game with ${id} not exists`);
    }
}

export async function updateAllGame(newData, id) {
    const gameFind = await game.findByPk(id);
    if(!gameFind) throw new Error(`The game with ${id} not exists`);
    try{
        Object.assign(gameFind, newData);
        return await gameFind.save();
    }catch(error){
        throw new Error(`Players cannot be update: ${error.message}`);
    } 
}

export async function deleteById(id){
    const gameFindById = await game.findByPk(id);
    if(!gameFindById) throw new Error(`The game with ${id} not exists`);
    try{
        await gameFindById.destroy();
    }catch(error){
        throw new Error(`Error deleting game: ${error.message}`);
    }
}

export async function patchGame(newData, id){
    const gameFind = await game.findByPk(id);
    if(!gameFind) throw new Error(`The game with ${id} not exists`);
    try{
        const gameUpdated = await gameFind.update(newData);
        return gameUpdated;
    }catch(error){
        throw new Error(`Error update game: ${error.message}`);
    }
}