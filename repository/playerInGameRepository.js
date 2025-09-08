import { IPlayerInGame } from "../interfaces/IPlayerInGame.js";
import db from "../models/index.js";
import Either from "../utils/Either.js";
export class playerInGameRepository extends IPlayerInGame {
  async savePlayerInGame(playerCards) {
    const playerSaved = await db.playerInGame.create(playerCards);
    return Either.right(playerSaved);
  }
  async getCardsByIdPlayer(idGame, idPlayer) {
    console.log("idGame, idPlayer", idGame, idPlayer);
    const findPlayer = await db.playerInGame.findOne({
      where: { id_game: idGame, id_player: idPlayer },
    });
    if (!findPlayer) {
      return Either.left({
        message: "Error not found player or game",
        statusCode: 404,
      });
    }
    return Either.right(findPlayer);
  }
  async updateCardsByIdPlayer(idGame, idPlayer, cards) {
    const getPlayer = await db.playerInGame.findOne({
      where: { id_game: idGame, id_player: idPlayer },
    });
    if (!getPlayer) {
      return Either.left({
        message: "Error not found player",
        statusCode: 404,
      });
    }

    await getPlayer.update({ cardsPlayer: cards });
    return Either.right(getPlayer);
  }

  async deleteACardByIdPlayer(idGame, idPlayer, cardId) {
    const getPlayer = await db.playerInGame.findOne({
      where: { id_game: idGame, id_player: idPlayer },
    });

    if (!getPlayer) {
      return Either.left({ message: "Player not found", statusCode: 404 });
    }
    const updatedCards = getPlayer.cardsPlayer.filter(
      (card) => card.id !== cardId
    );
    await getPlayer.update({ cardsPlayer: updatedCards });

    return Either.right(updatedCards);
  }

  async getAllPlayersInGame(idGame) {
    const players = await db.playerInGame.findAll({
      where: { id_game: idGame },
    });
    if (!players.length) {
      return Either.left({
        message: "No players in the game",
        statusCode: 404,
      });
    }
    return Either.right(players);
  }
}
