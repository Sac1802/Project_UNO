import { limitTimeGame } from "../../plugins/gameLimit.js";

export class GameCreationService {
  constructor(gameRepo) {
    this.gameRepo = gameRepo;
  }

  async createGame(dataGame, id_owner) {
    dataGame.game_owner = id_owner;
    dataGame.current_turn_player_id = id_owner;
    const createdGame = await this.gameRepo.createGame(dataGame);
    return {
      message: "Game created successfully",
      game_id: createdGame.id,
    };
  }

  async gameFast(data, id_owner) {
    if (data.max_players > 2) {
      throw new Error("The maximum number of players for a fast game is 2");
    }
    data.game_owner = id_owner;
    data.current_turn_player_id = id_owner;
    data.rules = "Quick game with a maximum of 2 people and a time limit";
    limitTimeGame(data, 5);
    data.status = "on_hold";
    const gameFast = await this.gameRepo.createGameFast(data);
    return {
      message: "Fast Game created successfully",
      game_id: gameFast.id,
    };
  }
}
