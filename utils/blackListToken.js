export const tokenBlackList =  new Set();

export  function  revokeToken(token){
    tokenBlackList.add(token);
}

export function isTokenRevoked(token){
    return tokenBlackList.has(token);
}