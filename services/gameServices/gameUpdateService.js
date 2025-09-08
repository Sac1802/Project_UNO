import Either from "../../utils/Either.js";

export class GameUpdateService {
  constructor(gameRepo) {
    this.gameRepo = gameRepo;
  }

  // Update all fields: fetch game first, then delegate to repo.updateGame(game, newData)
  async updateAllGame(newData, id) {
    const game = await this.gameRepo.getById(id);
    if (!game || typeof game === "object" && typeof game.isLeft === "function" && game.isLeft()) {
      return Either.left(
        { message: `The game with ${id} not exists` },
        { statuscode: 404 }
      );
    }
    // Tests expect raw updated object, not Either
    return await this.gameRepo.updateGame(game, newData);
  }

  async deleteById(id) {
    const game = await this.gameRepo.getById(id);
    if (!game || (typeof game.isLeft === "function" && game.isLeft())) {
      return Either.left(
        { message: `The game with ${id} not exists` },
        { statuscode: 404 }
      );
    }
    // Tests expect deleteGame(id)
    return await this.gameRepo.deleteGame(id);
  }

  async patchGame(newData, id) {
    const game = await this.gameRepo.getById(id);
    if (!game || (typeof game.isLeft === "function" && game.isLeft())) {
      return Either.left(
        { message: `The game with ${id} not exists` },
        { statuscode: 404 }
      );
    }
    // Tests expect raw updated object
    return await this.gameRepo.patchGame(game, newData);
  }
}
