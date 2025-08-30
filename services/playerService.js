import bcrypt from "../utils/bcrypt.js";
import Either from "../utils/Either.js";

export class PlayerService {
  constructor(playerRepo) {
    this.playerRepo = playerRepo;
  }

  async savePlayer(playerData) {
    const passwordEncrypt = await bcrypt.encryptPassword(playerData.password);
    playerData.password = passwordEncrypt;

    const savedPlayer = await this.playerRepo.savePlayer(playerData);

    if (savedPlayer.isLeft()) {
      return Either.left({
        message: "User could not be created (maybe already exists)",
        statusCode: 400,
      });
    }
    return Either.right({ message: "User registered successfully", id: savedPlayer.value.id });
  }

  async getPlayers() {
    const players = await this.playerRepo.getPlayers();
    if (players.isLeft()) {
      return Either.left({
        message: "Players cannot be obtained",
        statusCode: 404,
      });
    }
    return players;
  }

  async getByIdPlayer(id) {
    const playerById = await this.playerRepo.getByIdPlayer(id);
    if (playerById.isLeft()) {
      return Either.left({
        message: `The player with id ${id} does not exist`,
        statusCode: 404,
      });
    }
    return playerById;
  }

  async getByIdByToken(id) {
    const playerById = await this.playerRepo.getByIdPlayer(id);
    if (playerById.isLeft()) {
      return Either.left({
        message: `The player with id ${id} does not exist`,
        statusCode: 404,
      });
    }

    const playerData = playerById.value;
    return Either.right({
      id: playerData.id,
      username: playerData.username,
      email: playerData.email,
      age: playerData.age,
    });
  }

  async updateFullPlayer(newData, id) {
    const playerById = await this.playerRepo.getByIdPlayer(id);
    if (playerById.isLeft()) {
      return Either.left({
        message: `The player with id ${id} does not exist`,
        statusCode: 404,
      });
    }

    const updatedPlayer = await this.playerRepo.updateFullPlayer(id, newData);
    if (updatedPlayer.isLeft()) {
      return Either.left({
        message: "Players cannot be updated",
        statusCode: 500,
      });
    }
    return updatedPlayer;
  }

  async deletePlayer(id) {
    const playerById = await this.playerRepo.getByIdPlayer(id);
    if (playerById.isLeft()) {
      return Either.left({
        message: `The player with id ${id} does not exist`,
        statusCode: 404,
      });
    }

    const deleted = await this.playerRepo.deletePlayer(id);
    if (deleted.isLeft()) {
      return Either.left({
        message: "Error deleting player",
        statusCode: 500,
      });
    }
    return Either.right({ message: "Player deleted successfully" });
  }

  async patchPlayer(newData, id) {
    const playerById = await this.playerRepo.getByIdPlayer(id);
    if (playerById.isLeft()) {
      return Either.left({
        message: `The player with id ${id} does not exist`,
        statusCode: 404,
      });
    }

    const updatedPlayer = await this.playerRepo.patchPlayer(newData, id);
    if (updatedPlayer.isLeft()) {
      return Either.left({
        message: "Error updating player",
        statusCode: 500,
      });
    }
    return updatedPlayer;
  }
}
