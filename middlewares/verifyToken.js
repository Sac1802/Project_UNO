import jwt from 'jsonwebtoken'
import { isTokenRevoked } from '../utils/blackListToken.js'

export function  verifyToken(req, res,  next){
    const headersAuth = req.headers.authorization;
    if(!headersAuth?.startsWith('Bearer ')){
        return res.status(401).json({ message: 'Token missing or invalid' });
    }
    const token = headersAuth.split(' ')[1];
    if(isTokenRevoked(token)) {
        return res.status(403).json({message: 'Token  has been revoked'});
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch{
        return res.status(401).json({message: 'Invalid token'});
    }
}