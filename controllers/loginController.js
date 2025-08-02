import * as loginService from '../services/loginService.js'

export async function login(req, res, next){
    const userData = req.body;
    try{
        const result = await loginService.loginUser(userData);
        return res.status(200).json(result);
    }catch(error){
        next(error);
    }
}

export async function logout(req, res, next){
    const token = req.headers.autorization;
    try{
        const result = await loginService.logoutUser(token);
        return res.status(200).json(result);
    }catch(error){
        next(error);
    }
}