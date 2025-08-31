import player from "../models/player.js";
import bcrypt from "../utils/bcrypt.js";
import Either from "../utils/Either.js";
import { generateToken } from "../utils/generateToken.js";
import dotenv from "dotenv";
import * as blackListToken from "../utils/blackListToken.js";
dotenv.config();

export class LoginService {
  constructor(playerRepository) {
    this.playerRepository = playerRepository;
  }

  async loginUser(detailsUser) {
    const username = detailsUser.username;
    const password = detailsUser.password;

    const findUser = await this.playerRepository.findOne(username);
    if (!findUser) {
      const err = new Error("Invalid Credentials");
      err.name = "AuthError";
      err.statusCode = 400;
      throw err;
    }
    const matchPassword = await bcrypt.comparePasswords(password, findUser.right.password);
    if (!matchPassword) {
      const err = new Error("Invalid Credentials");
      err.name = "AuthError";
      err.statusCode = 400;
      throw err;
    }

    const token = await generateToken(findUser.right.id);
    return Either.right({ access_token: token });
  }

  async logoutUser(token) {
    const result = await blackListToken.isTokenRevoked(token);
    if (!result) {
      await blackListToken.revokeToken(token);
      return { message: "User logged out successfully" };
    } else {
      return { error: "The token is not valid or already revoked" };
    }
  }
}
