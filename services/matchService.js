import Either from "../utils/Either.js";
import { getIo } from "../utils/socket.js";

export class MatchService {
  constructor(matchRepository, gameRepository) {
    this.matchRepository = matchRepository;
    this.gameRepository = gameRepository;
  }

  async saveUserMatch(idGame, id_player) {
    const detailsGame = await this.gameRepository.getById(idGame);
    if (!detailsGame) return { message: "Game not found" };

    const numberOfMembers = await this.matchRepository.count(idGame);

    if (numberOfMembers >= detailsGame.max_players) {
      return { message: "Full game" };
    }

    const findUser = await this.matchRepository.findOne(idGame, id_player);

    if (!findUser) {
      await this.matchRepository.saveUserMatch({
        id_game: idGame,
        id_player: id_player,
        status: "wait",
      });
      const playersInGame = await this.matchRepository.getPlayers(idGame);
      const playerNames = playersInGame.map((p) => p.name);

      const io = getIo();
      io.to(`gmae${idGame}`).emit('PlayerJoined', {
        message: "User joined the game successfully",
        players: playerNames
      })

      return Either.right({
        message: "User joined the game successfully",
        players: playerNames,
      });
    } else {
      return Either.left(
        { message: "The user is already registered for this game" },
        { statusCode: 400 }
      );
    }
  }

  async changeStatus(idGame, id_player) {
    const findStatusUser = await this.matchRepository.findOne(
      idGame,
      id_player
    );

    if (!findStatusUser) {
      return Either.left(
        { message: "The user or game id does not exist" },
        { statusCode: 404 }
      );
    }
    findStatusUser.status = "ready";
    await this.matchRepository.changeStatus(findStatusUser, idGame, id_player);
    return Either.right({
      message: "User status changed to ready successfully",
    });
  }

  async changeStatusInGame(idGame, id_player) {
    const ownerGame = await this.gameRepository.getById(idGame);
    if (ownerGame.game_owner !== id_player) {
      return Either.left(
        { message: "Only the owner of the game can start the game" },
        { statuscode: 403 }
      );
    }

    const listUserChange = await this.matchRepository.getPlayers(idGame);
    if (listUserChange.length === 0)
      return Either.left(
        { message: "the game id does not exist" },
        { statusCode: 404 }
      );
    await this.matchRepository.changeStatusAllPlayers(
      { status: "inGame" },
      idGame
    );
    return Either.right({ message: "Game started successfully" });
  }

  async abandonmentGame(idGame, id_player) {
    const findGameById = await this.gameRepository.getById(idGame);
    if (!findGameById) {
      return Either.left({ message: "Game not found" }, { statusCode: 404 });
    }
    const matchStatus = await this.matchRepository.findOne(idGame, id_player);
    if (
      matchStatus.status === "inGame" &&
      findGameById.status === "in_progress"
    ) {
      const updateUser = await this.matchRepository.changeStatus(
        { status: "abandonment" },
        idGame,
        id_player
      );
      if (updateUser[0] === 0) {
        return Either.left(
          { message: "User not found in this game or already left" },
          { statusCode: 404 }
        );
      }
      return Either.right({ message: "User left the game successfully" });
    }
    return Either.left({
      message: "The game has not started or has alredy ended",
    });
  }

  async endGame(idGame, id_player) {
    const ownerGame = await this.gameRepository.getById(idGame);
    if (ownerGame.game_owner !== id_player) {
      return Either.left({
        message: "Only the owner of the game can start the game",
        statusCode: 403,
      });
    }

    const listUserChange = await this.matchRepository.listUser(idGame);
    if (listUserChange.length === 0)
      return Either.left({
        message: "the game id does not exist",
        statusCode: 404,
      });
    await this.matchRepository.changeStatusAllPlayers(
      { status: "finalized" },
      idGame
    );
    return Either.right({ message: "Game ended successfully" });
  }

  async getPlayers(idGame) {
    const gameFound = await this.gameRepository.getById(idGame);
    if (!gameFound)
      return Either.left({ message: "Game not found" }, { statuscode: 404 });

    const getPlayers = await this.matchRepository.getPlayers(idGame);

    const playersList = getPlayers.map((p) => p.player.username);
    return Either.right({
      game_id: idGame,
      players: playersList,
    });
  }
}
