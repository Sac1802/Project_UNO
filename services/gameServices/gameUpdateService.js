import Either from "../../utils/Either.js";

export class GameUpdateService {
  constructor(gameRepo) {
    this.gameRepo = gameRepo;
  }

  async updateAllGame(newData, id) {
    const updatedGame = await this.gameRepo.updateAllGame(newData, id);
    return Either.right(updatedGame);
  }

  async deleteById(id) {
    const gameFindById = await this.gameRepo.getById(id);
    if (gameFindById.isLeft())
      return Either.left(
        { message: `The game with ${id} not exists` },
        { statuscode: 404 }
      );
    const response = await this.gameRepo.deleteById(id);
    return response;
  }

  async patchGame(newData, id) {
    const gameFind = await this.gameRepo.getById(id);
    if (gameFind.isLeft())
      return Either.left(
        { message: `The game with ${id} not exists` },
        { statuscode: 404 }
      );
    const gameUpdated = await this.gameRepo.patchGame(newData, id);
    return gameUpdated;
  }

  
}
