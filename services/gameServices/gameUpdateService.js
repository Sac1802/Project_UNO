import Either from "../../utils/Either.js";

export class GameUpdateService {
  constructor(gameRepo) {
    this.gameRepo = gameRepo;
  }

  async updateAllGame(newData, id) {
    const gameFind = await this.gameRepo.getById(id);
    const updatedGame = await this.gameRepo.updateGame(gameFind, newData);
    return updatedGame;
  }

  async deleteById(id) {
    const gameFindById = await this.gameRepo.getById(id);
    if (!gameFindById)
      return Either.left(
        { message: `The game with ${id} not exists` },
        { statuscode: 404 }
      );
    const response = await this.gameRepo.deleteGame(id);
    return response;
  }

  async patchGame(newData, id) {
    const gameFind = await this.gameRepo.getById(id);
    if (!gameFind)
      return Either.left(
        { message: `The game with ${id} not exists` },
        { statuscode: 404 }
      );
    const gameUpdated = await this.gameRepo.patchGame(gameFind, newData);
    return gameUpdated;
  }

  
}
