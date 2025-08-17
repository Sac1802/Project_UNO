import player from "../models/player.js";
import { IPlayerRepository } from "../interfaces/IPlayerRepository.js";
import Either from "../utils/Either.js";

export class PlayerRepository extends IPlayerRepository {
  async savePlayer(data) {
    const savedPlayer = await player.create(data);
    if (!savedPlayer) {
      return Either.left({
        message: `The player could not be created`,
        statusCode: 500,
      });
    }
    return Either.right(savedPlayer);
  }

  async getPlayers() {
    const players = await player.findAll();
    if (!players || players.length === 0) {
      return Either.left({
        message: `No players found`,
        statusCode: 404,
      });
    }
    return Either.right(players);
  }

  async getByIdPlayer(id) {
    const playerInstance = await player.findByPk(id);
    if (!playerInstance) {
      return Either.left({
        message: `No player found with id ${id}`,
        statusCode: 404,
      });
    }
    return Either.right(playerInstance);
  }

  async updateFullPlayer(id, data) {
    const playerInstance = await player.findByPk(id);
    if (!playerInstance) {
      return Either.left({
        message: `No player found with id ${id}`,
        statusCode: 404,
      });
    }
    Object.assign(playerInstance, data);
    const updated = await playerInstance.save();
    return Either.right(updated);
  }

  async deletePlayer(id) {
    const deleted = await player.destroy({ where: { id } });
    if (!deleted) {
      return Either.left({
        message: `No player found with id ${id} to delete`,
        statusCode: 404,
      });
    }
    return Either.right(deleted);
  }

  async patchPlayer(newData, id) {
    const playerInstance = await player.findByPk(id);
    if (!playerInstance) {
      return Either.left({
        message: `No player found with id ${id}`,
        statusCode: 404,
      });
    }
    const updated = await playerInstance.update(newData);
    return Either.right(updated);
  }

  async findOne(username) {
    const foundPlayer = await player.findOne({ where: { username } });
    if (!foundPlayer) {
      return Either.left({
        message: `No player found with username ${username}`,
        statusCode: 404,
      });
    }
    return Either.right(foundPlayer);
  }
}
