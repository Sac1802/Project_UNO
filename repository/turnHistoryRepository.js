import { ITurnHistory } from "../interfaces/ITurnHistory.js";
import { TurnHistory } from "../models/turnHistory.js";
import Either from "../utils/Either.js";

export class TurnHistoryRepository extends ITurnHistory {
  async saveHistoryTurn(action, gameId, playerId) {
    const newTurnHistory = await TurnHistory.create({
      gameId,
      playerId,
      action,
    });
    return Either.right(newTurnHistory);
  }

  async getHistoryTurnsByGameId(gameId) {
    const historyTurns = await TurnHistory.findAll({ where: { gameId } });
    if (historyTurns.length === 0) {
      return Either.left("Not found history turns.");
    }
    return Either.right(historyTurns);
  }
}
