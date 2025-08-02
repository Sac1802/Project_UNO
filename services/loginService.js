import player from '../models/player.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { revokeToken, isTokenRevoked } from '../utils/blackListToken.js'
dotenv.config();

export async function loginUser(detailsUser){
    try{
        const username = detailsUser.username;
        const password = detailsUser.password;

        const findUser = await player.findOne({where: {username}});
        if (!findUser) {
            const err = new Error('Invalid Credentials');
            err.name = 'AuthError';
            err.statusCode = 400;
            throw err;
        }

        const matchPasswors = await bcrypt.compare(password, findUser.password);
        if (!matchPasswors) {
            const err = new Error('Invalid Credentials');
            err.name = 'AuthError';
            err.statusCode = 400;
            throw err;
        }

        const token =  await generateToken(findUser.id);
        return {access_token: token}
    }catch(error){
        throw new Error(error.message || 'Unable to log in');
    }
}

export function logoutUser(token) {
    const result = isTokenRevoked(token);
    if (!result) {
        revokeToken(token);
        return { message: 'User logged out successfully' };
    } else {
        return { error: 'The token is not valid or already revoked' };
    }
}



export async function getUserById(id){
    try{
        const findUser = await player.findByPk(id);
        return findUser;
    }catch(error){
        throw new Error(`The user with ${id} not exists`);
    }
}

async function generateToken(id){
    const token = jwt.sign(
        {playerId: id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES}
    );
    return token;
}
