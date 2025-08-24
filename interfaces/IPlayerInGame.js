import Either from "../utils/Either.js";

export class IPlayerInGame {
  savePlayerInGame(idGame, idPlayer, cards) {
    return Either.left({ message: "Error not implemented savePlayerInGame" });
  }
  getCardsByIdPlayer(idGame, idPlayer) {
    return Either.left({ message: "Error not implemented getCardsByIdPlayer" });
  }
  updateCardsByIdPlayer(idGame, idPlayer, cards) {
    return Either.left({
      message: "Error not implemented updateCardsByIdPlayer",
    });
  }
  deleteACardByIdPlayer(idGame, idPlayer, cardId) {
    return Either.left({
      message: "Error not implemented deleteACardByIdPlayer",
    });
  }
  insertAnreCard(idGame, idPlayer, cards) {
    return Either.left({ message: "Error not implemented insertAnreCard" });
  }
  getAllPlayersInGame(idGame) {
    return Either.left({
      message: "Error not implemented getAllPlayersInGame",
    });
  }
}
