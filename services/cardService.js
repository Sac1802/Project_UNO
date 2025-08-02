import card from "../models/cards.js";


export async function createCard(data){
    try{
        data.isDiscarded = false;
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
    const findCard = await  card.findByPk(id);
    if(!findCard) throw new Error(`Error can't get card with ${id}`);
    try{
        Object.assign(findCard, newData);
        return await findCard.save();
    }catch(error){
        throw new Error(`Error update card: ${error.message}`);
    }
}

export async function deleteById(id) {
    const findByIdCard = await card.findByPk(id);
    if(!findByIdCard) throw new Error(`Error can't get card with ${id}`);
    try{
        await findByIdCard.destroy();
    }catch(error){
        throw new Error(`Error delete card: ${error.message}`);
    }
}

export async function patchCard(newData, id) {
    const findByIdCard = await card.findByPk(id);
    if(!findByIdCard) throw new Error(`Error can't get card with ${id}`);
    try{
        const cardUpdated = findByIdCard.update(newData);
        return cardUpdated;
    }catch(error){
        throw new Error(`Error update card: ${error.message}`);
    }
}

export async function getTopCrad(id){
    try{
        const topCard = await card.findOne({
            where:{
                gameId: id,
                isDiscarded: true
            },
            order: [['id', 'DESC']]
        });
        if(!topCard) throw new Error('There are no letters in this game');
        return {
            game_id: id,
            top_card: `${topCard.value} of ${topCard.color}`
        }
    }catch(error){
        throw new Error(`Error get top card: ${error.message}`);
    }
}