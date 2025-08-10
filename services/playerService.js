import player from '../models/player.js'
import bcrypt from 'bcrypt'


export async function savePlayer(playerData) {
    try{
        const passwordEncrypt = await encryptPassword(playerData.password);
        playerData.password = passwordEncrypt;
        await player.create(playerData);
        return { message: 'User registered successfully' };
    }catch(error){
        throw new Error(`Error: User already exists`)
    }
}

export async function getPlayers(){
    try{
        const players = await player.findAll();
        return players;
    }catch(error){
        throw new Error(`Players cannot be obtained: ${error.message}`);
    }
}

export async function getByIdPlayer(id){
    try{
        const playerById = await player.findByPk(id);
        if(!playerById){
            throw new Error(`The player with ${id} not exists`);
        }
        return playerById;
    }catch(error){
        throw new Error(`The player with ${id} not exists`);
    }
}

export async function getByIdByToken(id){
    try{
        const playerById = await player.findByPk(id);
        return {
            id: playerById.id,
            username: playerById.username,
            email: playerById.email,
            age: playerById.age
        };
    }catch(error){
        throw new Error(`The player with ${id} not exists`);
    }
} 

export async function updateFullPlayer(newData, id){
    const userValid = await player.findByPk(id);
    if(!userValid) throw new Error(`Error the player with ${id} not exists`);
    try{
        Object.assign(userValid, newData);
        return await userValid.save();
    }catch(error){
        throw new Error(`Players cannot be update: ${error.message}`);
    }
}


export async function deletePlayer(id){
    const playerFind = await player.findByPk(id);
    if(!playerFind) throw new Error(`Error the player with ${id} not exists`);
    try{
        await playerFind.destroy();
    }catch(error){
        throw new Error(`Error deleting player: ${error.message}`)
    }
}


export async function patchPlayer(newData, id){
    const playerFind = await  player.findByPk(id);
    if(!playerFind) throw new Error(`Error the player with ${id} not exists`);
    try{
        const updatedPlayer = await playerFind.update(newData);
        return updatedPlayer;
    }catch(error){
        throw new Error(`Error update player: ${error.message}`);
    }
}

async function encryptPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}
