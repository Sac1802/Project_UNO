import {LoginService} from "../services/loginService.js";
import { PlayerRepository } from "../repository/playerRepository.js";

const playerRepository = new PlayerRepository();
const loginService = new LoginService(playerRepository);

export async function login(req, res, next) {
  const userData = req.body;
  const result = await loginService.loginUser(userData);
  return res.status(200).json(result);
}

export async function logout(req, res, next) {
  const token = req.headers.autorization;
  try {
    const result = await loginService.logoutUser(token);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
