import game from "../models/games.js";
import gameFast from "../models/gameFast.js";
import { IGameRepository } from "../interfaces/IGameRepository.js";
import Either from "../utils/Either.js";

export class GameRepository extends IGameRepository {
  async createGame(data) {
    return await game.create(data);
  }

  async getAllGames() {
    const games = await game.findAll();
    if (!games || games.length === 0) {
      return Either.left({message: "No games found", statusCode: 500});
    }
    return Either.right(games);
  }

  async getById(id, options = {}) {
    const game = await game.findByPk(id, options);
    if (!game) {
      return Either.left({message: "Game not found", statusCode: 404});
    }
    return Either.right(game);
  }

  async updateAllGame(data, id) {
    const gameInstance = await this.getById(id);
    if (!gameInstance) {
      return Either.left({message: "Game not found", statusCode: 404});
    }
    Object.assign(gameInstance, data);
    const updatedGame = await gameInstance.save();
    return Either.right(updatedGame);
  }

  async deleteById(id) {
    const deletedCount = await game.destroy({ where: { id } });
    if (deletedCount === 0) {
      return Either.left({message: "Game not found", statusCode: 404});
    }
    return Either.right("Game deleted successfully");
  }

  async patchGame(data, id) {
    const gameInstance = await this.getById(id);
    if (!gameInstance) {
      return Either.left({message: "Game not found", statusCode: 404});
    }
    const updatedGame = await gameInstance.update(data);
    return Either.right(updatedGame);
  }

  async gameFast(data) {
    const gameFastInstance = await gameFast.create(data);
    if (!gameFastInstance) {
      return Either.left({message: "Game fast creation failed", statusCode: 500});
    }
    return Either.right(gameFastInstance);
  }

  async startGame(data, idGame) {
    const gameInstance = await this.getById(idGame);
    if (!gameInstance) {
      return Either.left({message: "Game not found", statusCode: 404});
    }
    Object.assign(gameInstance, data);
    await gameInstance.save();
    return Either.right('Game started successfully');
  }

  async endGame(data, idGame) {
    const gameInstance = await this.getById(idGame);
    if (!gameInstance) {
      return Either.left({message: "Game not found", statusCode: 404});
    }
    Object.assign(gameInstance, data);
    await gameInstance.save();
    return Either.right('Game ended successfully');
  }

  async getCurrentPlayer(idGame){
    const gameInstance = await this.getById(idGame);
    if (!gameInstance) {
      return Either.left({message: "Game not found", statusCode: 404});
    }
    return Either.right(gameInstance.current_turn_player_id);
  }

  async startGameWithTimeLimit(data, idGame) {
    const gameInstance = await this.getById(idGame);
    if (!gameInstance) {
      return Either.left({message: "Game not found", statusCode: 404});
    }
    Object.assign(gameInstance, data);
    const updatedGame = await gameInstance.save();
    return Either.right(updatedGame);
  }

}
