export class IMatchRepository{
    saveUserMatch(data){ throw new Error('Method "saveUserMatch" not implemented'); }
    changeStatus(newData, idGame, idPlayer){ throw new Error('Method "changeStatus" not implemented'); }
    changeStatusAllPlayers(newData, idGame){ throw new Error('Method "changeStatusAllPlayers" not implemented'); }
    getPlayers(idGame){ throw new Error('Method "getPlayers" not implemented'); }
    findOne(idGame, idPlayer){ throw new Error('Method "findOne" not implemented'); }
    count(idGame){ throw new Error('Method "count" not implemented'); }
    listUser(idGame){ throw new Error('Method "listUser" not implemented'); }
}