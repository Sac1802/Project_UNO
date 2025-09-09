import { ITurnHistory } from "../interfaces/ITurnHistory.js";
import db from "../models/index.js";
import Either from "../utils/Either.js";

export class TurnHistoryRepository extends ITurnHistory {
  async saveHistoryTurn(action, game_id, player_id) {
    const newTurnHistory = await db.turnHistory.create({
      game_id,
      player_id,
      action,
    });
    return Either.right(newTurnHistory);
  }

  async getHistoryTurnsByGameId(game_id) {
    const historyTurns = await db.turnHistory.findAll({ where: { game_id } });
    if (historyTurns.length === 0) {
      return Either.left("Not found history turns.");
    }
    return Either.right(historyTurns);
  }
}
