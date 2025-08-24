import Either from "../utils/Either.js";
export class IGameRepository {
    createGame(data) {new Either.left("Method 'createGame()' must be implemented.");}
    getAllGames() {new Either.left("Method 'getAllGames()' must be implemented.");}
    getById(id, options = {}) {new Either.left("Method 'getById()' must be implemented.");}
    updateAllGame(data, id) {new Either.left("Method 'updateAllGame()' must be implemented.");}
    deleteById(id) {new Either.left("Method 'deleteById()' must be implemented.");}
    patchGame(data, id) {new Either.left("Method 'patchGame()' must be implemented.");}
    gameFast(data) {new Either.left("Method 'gameFast()' must be implemented.");}
    startGame(data, idGame){new Either.left("Method 'statGame()' must be implemented.");}
    endGame(data, idGame){new Either.left("Method 'endGame()' must be implemented.");}
    getCurrentPlayer(idGame){new Either.left("Method 'getCurrentPlayer()' must be implemented.");}
    startGameWithTimeLimit(data, idGame){new Either.left("Method 'startGameWithTimeLimit()' must be implemented.");}
    updateCurrentPlayer(idGame, playerId){new Either.left("Method 'updateCurrentPlayer()' must be implemented.")}
}
