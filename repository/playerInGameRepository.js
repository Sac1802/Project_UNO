import { IPlayerInGame } from "../interfaces/IPlayerInGame";
import { playerInGame } from "../models/playerInGame";
import Either from "../utils/Either.js";
export class playerInGameRepository extends IPlayerInGame {
  async savePlayerInGame(playerCards) {
    const playerSaved = await playerInGame.create(playerCards);
    return Either.right(playerSaved);
  }
  async getCardsByIdPlayer(idGame, idPlayer) {
    const findPlayer = await playerInGame.findOne({
      where: { id_game: idGame, id_player: idPlayer },
    });
    if (!findPlayer) {
      return Either.left("Error not found player or game");
    }
    return Either.right(findPlayer);
  }
  async updateCardsByIdPlayer(idGame, idPlayer, cards) {
    const getPlayer = await playerInGame.findOne({
      where: { id_game: idGame, id_player: idPlayer },
    });
    if (!getPlayer) {
      return Either.left("Error not found player");
    }
    await getPlayer.update({ cardsPlayer: cards });
    return Either.right(getPlayer);
  }

  async deleteACardByIdPlayer(idGame, idPlayer, cardId) {
    const getPlayer = await playerInGame.findOne({
      where: { id_game: idGame, id_player: idPlayer },
    });

    if (!getPlayer) {
      return Either.left("Player not found");
    }
    const updatedCards = getPlayer.cardsPlayer.filter(
      (card) => card.id !== cardId
    );
    await getPlayer.update({ cardsPlayer: updatedCards });

    return Either.right(updatedCards);
  }

  async getAllPlayersInGame(idGame) {
    const players = await playerInGame.findAll({ where: { id_game: idGame } });
    if (!players.length) {
      return Either.left("No players in the game");
    }
    return Either.right(players);
  }
}
