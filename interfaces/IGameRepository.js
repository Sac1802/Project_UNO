import Either from "../utils/Either.js";
export class IGameRepository {
    createGame(data) { Either.left("Method 'createGame()' must be implemented.");}
    getAllGames() { Either.left("Method 'getAllGames()' must be implemented.");}
    getById(id, options = {}) { Either.left("Method 'getById()' must be implemented.");}
    updateAllGame(data, id) { Either.left("Method 'updateAllGame()' must be implemented.");}
    deleteById(id) { Either.left("Method 'deleteById()' must be implemented.");}
    patchGame(data, id) { Either.left("Method 'patchGame()' must be implemented.");}
    gameFast(data) { Either.left("Method 'gameFast()' must be implemented.");}
    startGame(data, idGame){ Either.left("Method 'statGame()' must be implemented.");}
    endGame(data, idGame){ Either.left("Method 'endGame()' must be implemented.");}
    getCurrentPlayer(idGame){ Either.left("Method 'getCurrentPlayer()' must be implemented.");}
    startGameWithTimeLimit(data, idGame){ Either.left("Method 'startGameWithTimeLimit()' must be implemented.");}
    updateCurrentPlayer(idGame, playerId){ Either.left("Method 'updateCurrentPlayer()' must be implemented.")}
}
