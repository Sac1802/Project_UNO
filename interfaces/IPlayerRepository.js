export class IPlayerRepository {
    savePlayer(data) {throw new Error("Method 'createPlayer()' must be implemented.");}
    getPlayers() {throw new Error("Method 'getAllPlayers()' must be implemented.");}
    getByIdPlayer(id) {throw new Error("Method 'getById()' must be implemented.");}
    getByIdByToken(id) {throw new Error("Method 'getByIdByToken()' must be implemented.");}
    updateFullPlayer(id, data) {throw new Error("Method 'updatePlayer()' must be implemented.");}
    deletePlayer(id) {throw new Error("Method 'deletePlayer()' must be implemented.");}
    patchPlayer(newData, id) {throw new Error("Method 'patchPlayer()' must be implemented.");}
    findOne(username) {throw new Error("Method 'findOne()' must be implemented.");}
}
