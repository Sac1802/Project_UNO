import db from "../models/index.js";
import { IGameRepository } from "../interfaces/IGameRepository.js";
import Either from "../utils/Either.js";

export class GameRepository extends IGameRepository {
  async createGame(data) {
    const newGame = await db.game.create(data);
    return Either.right(newGame);
  }

  async getAllGames() {
    const games = await db.game.findAll();
    if (!games || games.length === 0) {
      return Either.left({ message: "No games found", statusCode: 500 });
    }
    return Either.right(games);
  }

  async getById(id, options = {}) {
    const gameInstance = await db.game.findByPk(id, options);
    if (!gameInstance) {
      return Either.left({ message: "Game not found", statusCode: 404 });
    }
    return Either.right(gameInstance);
  }

  async updateAllGame(data, id) {
    const gameInstance = await this.getById(id);
    if (gameInstance.isLeft()) {
      return gameInstance;
    }
    Object.assign(gameInstance.right, data);
    const updatedGame = await gameInstance.right.save();
    return Either.right(updatedGame);
  }

  async deleteById(id) {
    const deletedCount = await db.game.destroy({ where: { id } });
    if (deletedCount === 0) {
      return Either.left({ message: "Game not found", statusCode: 404 });
    }
    return Either.right("Game deleted successfully");
  }

  async patchGame(data, id) {
    const gameInstance = await this.getById(id);
    if (gameInstance.isLeft()) {
      return gameInstance;
    }
    const updatedGame = await gameInstance.right.update(data);
    return Either.right(updatedGame);
  }

  async gameFast(data) {
    const gameFastInstance = await db.gameFast.create(data);
    if (!gameFastInstance) {
      return Either.left({
        message: "Game fast creation failed",
        statusCode: 500,
      });
    }
    return Either.right(gameFastInstance);
  }

  async startGame(dataEither, idGame) {
    const result = await this.getById(idGame);

    if (result.isLeft()) {
      return result;
    }

    const gameInstance = result.right;

    const status = dataEither.right?.status;
    if (!status) {
      return Either.left({ message: "Status is required", statusCode: 400 });
    }

    gameInstance.status = status;
    await gameInstance.save();

    return Either.right("Game started successfully");
  }

  async endGame(dataEither, idGame) {
    const result = await this.getById(idGame);
    if (result.isLeft()) return result;
    const gameInstance = result.right;
    const status = dataEither.right?.status;
    if (!status) {
      return Either.left({ message: "Status is required", statusCode: 400 });
    }

    gameInstance.status = status;
    await gameInstance.save();
    return Either.right("Game ended successfully");
  }

  async updateCurrentPlayer(idGame, playerId) {
    if (!playerId) {
      return Either.left({ message: "Player ID is required", statusCode: 400 });
    }

    const gameInstance = await this.getById(idGame);
    if (gameInstance.isLeft()) return gameInstance;

    gameInstance.right.current_turn_player_id = playerId;
    const updatedGame = await gameInstance.right.save();
    return Either.right(updatedGame);
  }

  async startGameWithTimeLimit(data, idGame) {
    const gameInstance = await this.getById(idGame);
    if (gameInstance.isLeft()) {
      return gameInstance;
    }
    Object.assign(gameInstance.right, data);
    const updatedGame = await gameInstance.right.save();
    return Either.right(updatedGame);
  }

  async updateCurrentPlayer(idGame, playerId) {
    const gameInstance = await this.getById(idGame);
    if (gameInstance.isLeft()) {
      return gameInstance;
    }
    gameInstance.right.current_turn_player_id = playerId;
    const updatedGame = await gameInstance.right.save();
    return Either.right(updatedGame);
  }

  async getCurrentPlayer(idGame) {
    const gameInstance = await this.getById(idGame);
    if (gameInstance.isLeft()) {
      return gameInstance;
    }
    const currentPlayerId = gameInstance.right.current_turn_player_id;
    return Either.right(currentPlayerId);
  }
}
