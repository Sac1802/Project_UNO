import { IOrderGame } from "../interfaces/IOrderGame.js";
import OrderGame from "../models/orderGame.js";
import Either from "../utils/Either.js";

export class OrderGameRepository extends IOrderGame {
  async saveOrderGame(idGame, type) {
    return await OrderGame.create({ id_game: idGame, order_game: type });
  }

  async getOrdersByGame(idGame) {
    const orders = await OrderGame.find({
      where: { id_game: idGame },
    });
    if(!orders){
        return Either.left("Not match orde of game");
    }
    return Either.right(orders);
  }

  async updateOrderGame(idGame, order) {
    try{
        const updatedOrder = await OrderGame.update(
            {order_game},
            {where:{id_game:idGame}}
          );
          console.log(updatedOrder);
          return Either.right(updatedOrder);
    }catch(error){
        return Either.left(error.message);
    }
  }
}
