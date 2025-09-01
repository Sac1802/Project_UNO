import Either from "../utils/Either.js";

export class IMatchRepository{
    saveUserMatch(data){ Either.left('Method "saveUserMatch" not implemented'); }
    changeStatus(newData, idGame, idPlayer){ Either.left('Method "changeStatus" not implemented'); }
    changeStatusAllPlayers(newData, idGame){ Either.left('Method "changeStatusAllPlayers" not implemented'); }
    getPlayers(idGame){ Either.left('Method "getPlayers" not implemented'); }
    findOne(idGame, idPlayer){ Either.left('Method "findOne" not implemented'); }
    count(idGame){ Either.left('Method "count" not implemented'); }
    listUser(idGame){ Either.left('Method "listUser" not implemented'); }
    getPlayersId(idGame){ Either.left('Method "getPlayersId" not implemented'); }
}