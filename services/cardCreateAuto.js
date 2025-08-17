import card from "../models/cards.js";

export class CardCreateAuto {
  constructor(cardRepository) {
    this.cardRepository = cardRepository;
  }
  async saveCardsAuto(id) {
    const colors = ["red", "green", "blue", "yellow"];
    const values = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "Skip",
      "Reverse",
      "Draw2",
    ];
    const wildCards = ["Wild", "Wild_Draw4"];

    try {
      for (const color of colors) {
        for (const value of values) {
          const count = value === "0" ? 1 : 2;
          for (let i = 0; i < count; i++) {
            const cardUNO = {
              color,
              value,
              gameId: id,
              isDiscarded: false,
            };
            await this.cardRepository.createCard(cardUNO);
          }
        }
      }

      for (const type of wildCards) {
        for (let i = 0; i < 4; i++) {
          const cardWild = {
            color: "black",
            value: type,
            gameId: id,
            isDiscarded: false,
          };
          await card.create(cardWild);
        }
      }
    } catch (error) {
      throw new Error(`Error creating cards: ${error.message}`);
    }
  }
}
