import game from "../models/games.js";
import player from "../models/player.js";

export async function createGame(dataGame, id_owner) {
    try{
        dataGame.game_owner =  id_owner;
        dataGame.current_turn_player_id = id_owner;
        const createdGame = await game.create(dataGame);
        return {
            message: 'Game created successfully',
            game_id: createdGame.id
        };
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

export async function startGame(idGame, id_player){
    const gameFind = await game.findByPk(idGame);
    if(!gameFind) throw new Error(`The game with ${id} not exists`);
    try{
        if(gameFind.game_owner === id_player){
            await gameFind.update({status: 'in_progress'});
            return {message: "Game started successfully"};
        }else{
            return {message: 'Only the owner of the game can start the game'};
        }
    }catch(error){
        return {message: 'An error occurred while changing the status of game ',error: error.message};
    }
}

export async function endGame(idGame, id_player){
    const gameFind = await game.findByPk(idGame);
    if(!gameFind) throw new Error(`The game with ${id} not exists`);
    try{
        if(gameFind.game_owner === id_player){
            await gameFind.update({status: 'finalized'});
            return {message: "Game ended successfully"};
        }else{
            return {message: 'Only the owner of the game can start the game'};
        }
    }catch(error){
        return {message: 'An error occurred while changing the status of game',error: error.message};
    }
}
export async function getStatusGame(idGame) {
    const gameFind = await game.findByPk(idGame);
    if(!gameFind) throw new Error(`The game with ${idGame} not exists`);
    try{
        return {
            game_id: idGame,
            state: gameFind.status
        }
    }catch(error){
        return {message: 'An error occurred while getting the status of game ',error: error.message}
    }
}

export async function getCurrentPlayer(idGame) {
    try {
        const gameData = await game.findByPk(idGame, {
            include: {
                model: player,
                as: 'currentPlayer',
                attributes: ['username'],
                required: false
            }
        });

        if (!gameData) {
            return { message: 'Game not found' };
        }

        const username = gameData.currentPlayer?.username;
        return {
            game_id: idGame,
            current_player: username ? username : 'Unknown'
        };
    } catch (error) {
        return {
            message: 'An error occurred while retrieving the current player',
            error: error.message
        };
    }
}
