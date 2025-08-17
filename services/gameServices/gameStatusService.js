import { limitTimeGame } from "../../plugins/gameLimit.js";
import Either from "../../utils/Either.js";

export class GameStatusService {
  constructor(gameRepo) {
    this.gameRepo = gameRepo;
  }

  async startGame(idGame, id_player) {
    const gameFind = await this.gameRepo.getById(idGame);
    if (!gameFind) throw new Error(`The game with ${idGame} not exists`);
    if (gameFind.game_owner === id_player) {
      gameFind.status = "in_progress";
      const startgame = await this.gameRepo.startGame(gameFind, idGame);
      return startgame;
    } else {
      return Either.left({
        message: "Only the owner of the game can start the game",
        statuscode: 403,
      });
    }
  }

  async endGame(idGame, id_player) {
    const gameFind = await this.gameRepo.getById(idGame);
    if (!gameFind)
      return Either.left(`The game with ${idGame} not exists`, {
        statuscode: 404,
      });
    gameFind.status = "finalized";
    const response = await this.gameRepo.endGame(gameFind, idGame);
    return response;
  }
  async getStatusGame(idGame) {
    const gameFind = await this.gameRepo.getById(idGame);
    if (!gameFind)
      return Either.left(`The game with ${idGame} not exists`, {
        statuscode: 404,
      });
    return {
      game_id: idGame,
      state: gameFind.status,
    };
  }

  async startGameWithTimeLimit(idGame, id_player, timeLimit) {
    const gameFind = await this.gameRepo.getById(idGame);
    if (!gameFind)
      return Either.left(`The game with ${idGame} not exists`, {
        statuscode: 404,
      });
    if (gameFind.game_owner === id_player) {
      limitTimeGame(gameFind, timeLimit);
      gameFind.status = "in_progress";
      const response =await this.gameRepo.startGameWithTimeLimit(gameFind, idGame);
      return { message: "Game started successfully" };
    } else {
      return Either.left(
        { message: "Only the owner of the game can start the game" },
        { statuscode: 403 }
      );
    }
  }
}
