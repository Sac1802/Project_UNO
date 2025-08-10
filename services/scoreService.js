import player from "../models/player.js";
import score from "../models/score.js";

export async function saveScore(scoreData) {
    try{
        const savedScore = await score.create(scoreData);
        return savedScore;
    }catch(error){
        throw new Error(`Error creating score: ${error.message}`)
    }
}

export async function getAllScore(){
    try{
        const getAllScore = await score.findAll();
        return getAllScore;
    }catch(error){
        throw new Error(`Error score cannot be obtained: ${error.message}`)
    }
}

export async function getById(id){
    try{
        const findScoreById = await score.findByPk(id);
        return findScoreById;
    }catch(error){
        throw new Error(`The score with ${id} not exists`);
    }
}

export async function updateAll(newData, id){
    const findById = await score.findByPk(id);
    if(!findById) throw new Error(`The score with ${id} not exists`);
    try{
        Object.assign(findById, newData);
        return await findById.save();
    }catch(error){
        throw new Error(`Score cannot be update: ${error.message}`);
    } 
}


export async function deleteById(id){
    const findById = await score.findByPk(id);
    if(!findById) throw new Error(`The score with ${id} not exists`);
    try{
        await findById.destroy();
    }catch(error){
        throw new Error(`Error deleting score: ${error.message}`);
    }
}

export async function patchScore(newData, id){
    const findById = await score.findByPk(id);
    if(!findById) throw new Error(`The score with ${id} not exists`);
    try{
        const newScore =  await findById.update(newData);
        return newScore;
    }catch(error){
        throw new Error(`Error update score: ${error.message}`);
    }
}

export async function scoreAllPlayers(idGame) {
    try{
        const findScoreByGame = await score.findAll({
        where: {
            gameId: idGame
        },
        include: {
                model: player,
                attributes: ['username']
            }
        });

        if(findScoreByGame.length === 0) throw new Error('The game ID does not correspond to any stored')
        const scorePlayers = findScoreByGame.map(p => ({
            username: p.player.username,
            score: p.score
        }));

        return {
            game_id: idGame,
            score: scorePlayers
        };
    }catch(error){
        throw new Error(`Error: ${error.message || error}`);
    }
}
