import player from '../models/player.js'

export async function savePlayer(playerData) {
    try{
        const newPlayer = await player.create(playerData);
        return newPlayer;
    }catch(error){
        throw new Error(`Error creating player: ${error.message}`)
    }
}