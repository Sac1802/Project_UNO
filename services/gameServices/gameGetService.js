import player from "../../models/player.js";
import Either from "../../utils/Either.js";
export class GameGetService {
  constructor(gameRepo) {
    this.gameRepo = gameRepo;
  }

  async getAllGames() {
    const getAllGames = await this.gameRepo.getAllGames();
    return getAllGames;
  }

  async getById(id) {
    const getGameById = await this.gameRepo.getById(id);
    return getGameById;
  }

  async getCurrentPlayer(idGame) {
    const gameData = await this.gameRepo.getById(idGame, {
      include: {
        model: player,
        as: "currentPlayer",
        attributes: ["username"],
        required: false,
      },
    });
    if (!gameData) {
      return Either.left({ message: "Game not found", statuscode: 404 });
    }
    const username = gameData.currentPlayer?.username;
    return {
      game_id: idGame,
      current_player: username ? username : "Unknown",
    };
  }
}
