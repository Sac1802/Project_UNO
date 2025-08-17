export class ICardRepository {
    createCard(data) {throw new Error("Method 'createCard()' must be implemented.");}
    getAllCards() {throw new Error("Method 'getAllCards()' must be implemented.");}
    getByIdCard(id, options = {}) {throw new Error("Method 'getByIdCard()' must be implemented.");}
    updateAll(data, id) {throw new Error("Method 'updateAllCard()' must be implemented.");}
    deleteById(id) {throw new Error("Method 'deleteById()' must be implemented.");}
    patchCard(data, id) {throw new Error("Method 'patchCard()' must be implemented.");}
    topCard(id) {throw new Error("Method 'topCard()' must be implemented.");}  
}