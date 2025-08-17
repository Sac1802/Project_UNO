export class IGameRepository {
    createGame(data) {throw new Error("Method 'createGame()' must be implemented.");}
    getAllGames() {throw new Error("Method 'getAllGames()' must be implemented.");}
    getById(id, options = {}) {throw new Error("Method 'getById()' must be implemented.");}
    updateAllGame(data, id) {throw new Error("Method 'updateAllGame()' must be implemented.");}
    deleteById(id) {throw new Error("Method 'deleteById()' must be implemented.");}
    patchGame(data, id) {throw new Error("Method 'patchGame()' must be implemented.");}
    gameFast(data) {throw new Error("Method 'gameFast()' must be implemented.");}
    startGame(data, idGame){throw new Error("Method 'statGame()' must be implemented.");}
    endGame(data, idGame){throw new Error("Method 'endGame()' must be implemented.");}
    getCurrentPlayer(idGame){throw new Error("Method 'getCurrentPlayer()' must be implemented.");}
    startGameWithTimeLimit(data, idGame){throw new Error("Method 'startGameWithTimeLimit()' must be implemented.");}
}
