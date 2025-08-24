import Either from "../utils/Either.js";
export class CardsService {
  constructor(cardRepo) {
    this.cardRepo = cardRepo;
  }

  async createCard(data) {
    data.isDiscarded = false;
    const cardSaved = await this.cardRepo.createCard(data);
    return cardSaved;
  }

  async getAllCards() {
    const findAllCards = await this.cardRepo.getAllCards();
    return findAllCards;
  }

  async getByIdCard(id) {
    const findById = await this.cardRepo.getByIdCard(id);
    return findById;
  }

  async updateAll(newData, id) {
    const findCard = await this.cardRepo.getByIdCard(id);
    if (!findCard.isRight()) return findCard;
    const cardUpdated = await this.cardRepo.updateAll(newData, id);
    return cardUpdated;
  }

  async deleteById(id) {
    const findByIdCard = await this.cardRepo.getByIdCard(id);
    if (!findByIdCard.isRight()) return findByIdCard;
    const cardDeleted = await this.cardRepo.deleteById(id);
    return cardDeleted;
  }

  async patchCard(newData, id) {
    const findByIdCard = await this.cardRepo.getByIdCard(id);
    if (!findByIdCard.isRight()) return findByIdCard; // Return the left result from repository
    const cardUpdated = await this.cardRepo.patchCard(newData, id);
    return cardUpdated;
  }

  async getTopCard(id) {
    const topCardResult = await this.cardRepo.topCard(id);
    if (!topCardResult.isRight()) {
      return topCardResult;
    }
    const topCard = topCardResult.value;
    return Either.right({
      game_id: id,
      top_card: `${topCard.value} of ${topCard.color}`,
    });
  }
}
