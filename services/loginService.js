import player from "../models/player.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Either from "../utils/Either.js";
import dotenv from "dotenv";
import * as blackListToken from "../utils/blackListToken.js";
dotenv.config();

export async function loginUser(detailsUser) {
  const username = detailsUser.username;
  const password = detailsUser.password;

  const findUser = await player.findOne({ where: { username } });
  if (!findUser) {
    const err = new Error("Invalid Credentials");
    err.name = "AuthError";
    err.statusCode = 400;
    throw err;
  }

  const matchPasswors = await bcrypt.compare(password, findUser.password);
  if (!matchPasswors) {
    const err = new Error("Invalid Credentials");
    err.name = "AuthError";
    err.statusCode = 400;
    throw err;
  }

  const token = await generateToken(findUser.id);
  return Either.right({ access_token: token });
}

export async function logoutUser(token) {
  const result = await blackListToken.isTokenRevoked(token);
  if (!result) {
    await blackListToken.revokeToken(token);
    return { message: "User logged out successfully" };
  } else {
    return { error: "The token is not valid or already revoked" };
  }
}

export async function getUserById(id) {
  try {
    const findUser = await player.findByPk(id);
    if(findUser){
        return Either.right(findUser);
    }else{
        return Either.left(new Error(`The user with ${id} not exists`));
    }
  } catch (error) {
    throw new Error(`The user with ${id} not exists`);
  }
}

async function generateToken(id) {
  return (token = jwt.sign({ playerId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  }));
}
