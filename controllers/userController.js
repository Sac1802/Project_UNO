import * as userService from '../services/userService.js'

export async function createUser(req, res, next) {
  const data = req.body;

  if (validateInputScore(data)) {
    return res.status(400).json({ message: 'All fields must be completed' });
  }

  try {
    const userCreated = await userService.saveUser(data);
    return res.status(201).json(userCreated);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next){
    const data = req.body;
    try{
        const loginSuccess = await userService.loginUser(data);
        return res.status(200).json(loginSuccess);
    }catch(error){
        next(error);
    }
}

export async function getUser(req, res, next){
    const userId = req.user.playerId;
    try{
        const findUser = await userService.getUserById(userId);
        return res.status(200).json(findUser);
    }catch(error){;
        next(error)
    }
}

export async function logout(req, res, next) {
    const access_token = req.headers.authorization;
    if(!access_token) return res.status(400).json({message: 'Access token required'});
    const result = userService.loginUser(access_token);
    return res.status(200).json(result);
}

function validateInputScore(data){
    return Object.values(data).some(val => 
        val  === null || val === undefined || val  === '');
}