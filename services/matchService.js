import match from "../models/match.js";
import game from "../models/games.js";
import player from "../models/player.js";


export async function saveUserMatch(idGame, id_player) {
    try {
        const detailsGame = await game.findByPk(idGame);
        if (!detailsGame) return { message: 'Game not found' };

        const numberOfMembers = await match.count({
            where: { id_game: idGame }
        });

        if (numberOfMembers >= detailsGame.max_players) {
            return { message: 'Full game' };
        }

        const findUser = await match.findOne({
            where: {
                id_game: idGame,
                id_player: id_player
            }
        });

        if (!findUser) {
            await match.create({
                id_game: idGame,
                id_player: id_player,
                status: 'wait'
            });
            return { message: 'User joined the game successfully' };
        } else {
            return { message: 'The user is already registered for this game' };
        }

    } catch (error) {
        return { message: 'An error occurred while joining the game', error: error.message };
    }
}

export async function changeStatus(idGame, id_player) {
    try {
        const findStatusUser = await match.findOne({
            where: {
                id_game: idGame,
                id_player: id_player
            }
        });

        if (!findStatusUser) {
            throw new Error('The user or game id does not exist');
        }
        await findStatusUser.update({ status: 'ready' });
        return { message: 'User status changed to ready successfully' };
    } catch (error) {
        return {message: 'An error occurred while changing the status of the user',error: error.message};
    }
}

export async function changeStatusInGame(idGame, id_player) {
    try{
        const ownerGame = await game.findByPk(idGame);
        if(ownerGame.game_owner !== id_player){
            return {message: 'Only the owner of the game can start the game'};
        }

        const listUserChange = await match.findAll({
            where:{
                id_game: idGame
            }
        });
        if(listUserChange.length === 0) throw new Error('the game id does not exist');
        await match.update(
            {status: 'inGame'},
            {
                where:{
                    id_game: idGame
                }
            }
        )
        return {message: 'Game started successfully'};
    }catch(error){
        return {message: 'An error occurred while changing the status of all users ',error: error.message};
    }
}

export async function abandonmentGame(idGame, id_player){
    try{
        const findGameById = await game.findByPk(idGame);
        if(!findGameById){
            return {message: 'Game not found'};
        }
        const matchStatus = await match.findOne({
            where: {
                id_game: idGame,
                id_player: id_player
            }
        });
        console.log(findGameById.status);
        console.log(matchStatus.status);
        if(matchStatus.status === 'inGame' && findGameById.status === 'in_progress'){
            const updateUser = await match.update(
                { status: 'abandonment' },
                {
                    where: {
                        id_game: idGame,
                        id_player: id_player
                    }
                }
            );
            if(updateUser[0] === 0){
                return { message: 'User not found in this game or already left' };
            }
            return { message: 'User left the game successfully' };
        }
        return {message: 'The game has not started or has alredy ended'}
        
    } catch (error) {
        return { message: 'An error occurred while abandoning the game', error: error.message };
    }
}

export async function endGame(idGame, id_player) {
    try{
        const ownerGame = await game.findByPk(idGame);
        if(ownerGame.game_owner !== id_player){
            return {message: 'Only the owner of the game can start the game'};
        }

        const listUserChange = await match.findAll({
            where:{
                id_game: idGame
            }
        });
        if(listUserChange.length === 0) throw new Error('the game id does not exist');
        await match.update(
            {status: 'finalized'},
            {
                where:{
                    id_game: idGame
                }
            }
        )
        return {message: 'Game ended successfully'}; 
    }catch(error){
        return {message: 'An error occurred while changing the status of all users ',error: error.message};
    }
}

export async function getPlayers(idGame) {
    try {
        const gameFound = await game.findByPk(idGame);
        if (!gameFound) return { message: 'Game not found' };

        const getPlayers = await match.findAll({
            where: { id_game: idGame },
            include: {
                model: player,
                attributes: ['username']
            }
        });

        const playersList = getPlayers.map(p => p.player.username);
        return {
            game_id: idGame,
            players: playersList
        };
    } catch (error) {
        return {
            message: 'An error occurred while retrieving players',
            error: error.message
        };
    }
}
