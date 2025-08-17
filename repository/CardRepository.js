import card from '../models/cards.js';
import { ICardRepository } from '../interfaces/ICardRepository.js';
import Either from '../utils/Either.js';

export class CardRepository extends ICardRepository {
    async createCard(data) {
        const createdCard = await card.create(data);
        if(!createdCard) {
            return Either.left({message: `The card could not be created`, statusCode: 500});
        }
        return Either.right(createdCard);
    }

    async getAllCards() {
        const findCard =  await card.findAll();
        if(!findCard) {
            return Either.left({message: `No cards found`, statusCode: 404});
        }
        return Either.right(findCard);
    }

    async getByIdCard(id, options = {}) {
        const findCard = await card.findByPk(id, options);
        if (!findCard) {
            return Either.left({message: `Card with id ${id} not found`, statusCode: 404});
        }
        return Either.right(findCard);
    }

    async updateAll(data, id) {
        const cardToUpdate = await card.findByPk(id);
        if (!cardToUpdate) {
            return Either.left({message: `Card with id ${id} not found`, statusCode: 404});
        }
        Object.assign(cardToUpdate, data);
        const updatedCard = await cardToUpdate.save();
        return Either.right(updatedCard);
    }

    async deleteById(id) {
        const cardToDelete = await card.findByPk(id);
        if (!cardToDelete) {
            return Either.left({message: `Card with id ${id} not found`, statusCode: 404});
        }
        await card.destroy({ where: { id } });
        return Either.right();
    }

    async patchCard(data, id) {
        const cardToPatch = await card.findByPk(id);
        if (!cardToPatch) {
            return Either.left({message: `Card with id ${id} not found`, statusCode: 404});
        }
        Object.assign(cardToPatch, data);
        const updatedCard = await cardToPatch.save();
        return Either.right(updatedCard);
    }

    async topCard(id) {
        const topCard = await card.findOne({
            where: {
                gameId: id,
                isDiscarded: true,
            },
            order: [["id", "DESC"]],
        });
        if (!topCard) {
            return Either.left({message: `There are no cards in this game`, statusCode: 404});
        }
        return Either.right(topCard);
    }
}
