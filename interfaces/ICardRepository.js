import Either from "../utils/Either.js";

export class ICardRepository {
    createCard(data) {new Either.left("Method 'createCard()' must be implemented.");}
    getAllCards() {new Either.left("Method 'getAllCards()' must be implemented.");}
    getByIdCard(id, options = {}) {new Either.left("Method 'getByIdCard()' must be implemented.");}
    updateAll(data, id) {new Either.left("Method 'updateAllCard()' must be implemented.");}
    deleteById(id) {new Either.left("Method 'deleteById()' must be implemented.");}
    patchCard(data, id) {new Either.left("Method 'patchCard()' must be implemented.");}
    topCard(id) {new Either.left("Method 'topCard()' must be implemented.");}  
    getCardByIdgame(idGame){ new Either.left("Method 'getCardByIdgame()' must be implemented.")}
    updateDiscardCard(idCard) {new Either.left("Method 'updateDiscardCard()' must be implemented.")}
}