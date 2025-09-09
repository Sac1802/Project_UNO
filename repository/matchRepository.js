import db from "../models/index.js";
import { IMatchRepository } from "../interfaces/IMatchRepository.js";
import Either from "../utils/Either.js";

export class MatchRepository extends IMatchRepository {
  async saveUserMatch(data) {
    const savedUser = await db.match.create(data);
    if (!savedUser) {
      return Either.left({
        message: `The match could not be created`,
        statusCode: 500,
      });
    }
    return Either.right(savedUser);
  }

  async changeStatus(newData, idGame, idPlayer) {
    const updatedMatch = await db.match.update(newData, {
      where: {
        id_game: idGame,
        id_player: idPlayer,
      },
    });
    if (!updatedMatch) {
      return Either.left({
        message: `The match could not be updated`,
        statusCode: 500,
      });
    }
    return Either.right(updatedMatch);
  }

  async changeStatusAllPlayers(newData, idGame) {
    const updatedMatches = await db.match.update(newData, {
      where: {
        id_game: idGame,
      },
    });
    if (!updatedMatches) {
      return Either.left({
        message: `The match could not be updated`,
        statusCode: 404,
      });
    }
    return Either.right(updatedMatches);
  }

  async getPlayers(idGame) {
    const players = await db.match.findAll({
      where: { id_game: idGame },
      include: {
        model: db.player,
        attributes: ["username"],
      },
    });
    if (!players || players.length === 0) {
      return Either.left({
        message: `No players found for game ${idGame}`,
        statusCode: 404,
      });
    }
    return Either.right(players);
  }

  async getPlayersAsc(idGame) {
    const players = await db.match.findAll({
      where: { id_game: idGame },
      order: [["id", "ASC"]],
      include: {
        model: db.player,
        attributes: ["username"],
      },
    });
    if (!players || players.length === 0) {
      return Either.left({
        message: `No players found for game ${idGame}`,
        statusCode: 404,
      });
    }
    return Either.right(players);
  }

  async getPlayersDesc(idGame) {
    const players = await db.match.findAll({
      where: { id_game: idGame },
      order: [["turn", "DESC"]],
      include: {
        model: db.player,
        attributes: ["username"],
      },
    });
    if (!players || players.length === 0) {
      return Either.left({
        message: `No players found for game ${idGame}`,
        statusCode: 404,
      });
    }
    return Either.right(players);
  }

  async getPlayersId(idGame) {
    const players = await db.match.findAll({
      where: { id_game: idGame },
      include: {
        model: db.player,
        attributes: ["id", "username"],
      },
    });
    if (!players || players.length === 0) {
      return Either.left({
        message: `No players found for game ${idGame}`,
        statusCode: 404,
      });
    }
    return Either.right(players);
  }

  async findOne(idGame, idPlayer) {
    const playerMatch = await db.match.findOne({
      where: {
        id_game: idGame,
        id_player: idPlayer,
      },
    });
    if (!playerMatch) {
      return Either.left({
        message: `No match found for player ${idPlayer} in game ${idGame}`,
        statusCode: 404,
      });
    }
    return Either.right(playerMatch);
  }

  async count(idGame) {
    const count = await db.match.count({
      where: {
        id_game: idGame,
      },
    });
    if (!count) {
      return Either.left({
        message: `No matches found for game ${idGame}`,
        statusCode: 404,
      });
    }
    return Either.right(count);
  }

  async listUser(idGame) {
    const playerMatches = await db.match.findAll({
      where: {
        id_game: idGame,
      },
    });
    if (!playerMatches || playerMatches.length === 0) {
      return Either.left({
        message: `No matches found for game ${idGame}`,
        statusCode: 404,
      });
    }
    return Either.right(playerMatches);
  }
}
