import * as cardService from '../services/cardService.js'

export async function createCard(req, res, next) {
    const dataCard = req.body;
    if(validateInputCard(dataCard)) return res.status(400).json({message : 'All fields must be completed'});
    try{
        const gameCreated = await cardService.createCard(dataCard);
        return res.status(201).json(gameCreated);
    }catch(error){
        next(error);
    }
}

export async function getAllCards(req,  res, next){
    try{
        const cardsFindAll =  await cardService.getAllCards();
        return res.status(200).json(cardsFindAll);
    }catch(error){
        next(error);
    }
}

export async function getByIdCard(req, res, next) {
    const id = req.params.id;
    try{
        const cardFindById = await cardService.getByIdCard(id);
        return res.status(200).json(cardFindById);
    }catch(error){
        next(error);
    }
}

export async function updateAllCard(req, res, next){
    const dataNewCard = req.body;
    const id = req.params.id;
    if(validateInputCard(dataNewCard)) return res.status(400).json({message : 'All fields must be completed'});
    try{
        const cardUpdated = await cardService.updateAll(dataNewCard, id);
        return res.status(200).json(cardUpdated);
    }catch(error){
        next(error);
    }
}

export async function deleteById(req, res, next) {
    const id = req.params.id;
    try{
        await cardService.deleteById(id);
        return res.status(204).send();
    }catch(error){
        next(error);
    }
}


export async function patchCard(req, res, next){
    const newData =  req.body;
    const id = req.params.id;
    try{
        const updatedCard = await cardService.patchCard(newData,  id);
        return res.status(200).json(updatedCard);
    }catch(error){
        next(error);
    }
}

function validateInputCard(data){
    return Object.values(data).some(val => 
        val === null || val === undefined || val === '');
}