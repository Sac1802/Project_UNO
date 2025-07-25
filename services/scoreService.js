import score from "../models/score.js";

export async function saveScore(scoreData) {
    try{
        const savedScore = score.create(scoreData);
        return savedScore;
    }catch(error){
        throw new Error(`Error creating score: ${error.message}`)
    }
}

export async function getAllScore(){
    try{
        const getAllScore = score.findAll();
        return getAllScore;
    }catch(error){
        throw new Error(`Error score cannot be obtained: ${error.message}`)
    }
}

export async function getById(id){
    try{
        const findScoreById = score.findByPk(id);
        return findScoreById;
    }catch(error){
        throw new Error(`The score with ${id} not exists`);
    }
}

export async function updateAll(newData, id){
    const findById = score.findByPk(id);
    if(!findById) throw new Error(`The score with ${id} not exists`);
    try{
        Object.assign(findById, newData);
        return await findById.save();
    }catch(error){
        throw new Error(`Score cannot be update: ${error.message}`);
    } 
}