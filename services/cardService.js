import card from "../models/cards.js";


export async function createCard(data){
    try{
        const cardSaved = card.create(data);
        return cardSaved;
    }catch(error){
        throw new Error(`Error create card: ${error.message}`);
    }
}

export async function getAllCards() {
    try{
        const findAllCards = card.findAll();
        return findAllCards;
    }catch(error){
        throw new Error(`Error get all cards: ${error.message}`);
    }
}

export async function getByIdCard(id) {
    try{
        const finById = card.findByPk(id);
        return finById;
    }catch(error){
        throw new Error(`Error get card by Id: ${error.message}`);
    }
}

export async function updateAll(newData,  id) {
    const findByIdCard = card.findByPk(id);
    if(!findByIdCard) throw new Error(`Error can't get card with ${id}`);
    try{
        Object.assign(findByIdCard, newData);
        return await findByIdCard.save();
    }catch(error){
        throw new Error(`Error update card: ${error.message}`);
    }
}

export async function deleteById(id) {
    const findByIdCard = card.findByPk(id);
    if(!findByIdCard) throw new Error(`Error can't get card with ${id}`);
    try{
        await findByIdCard.destroy();
    }catch(error){
        throw new Error(`Error delete card: ${error.message}`);
    }
}

export async function patchCard(newData, id) {
    const findByIdCard = card.findByPk(id);
    if(!findByIdCard) throw new Error(`Error can't get card with ${id}`);
    try{
        const cardUpdated = findByIdCard.update(newData);
        return cardUpdated;
    }catch(error){
        throw new Error(`Error update card: ${error.message}`);
    }
}