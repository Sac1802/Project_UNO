import { IOrderGame } from "../interfaces/IOrderGame.js";
import db from "../models/index.js";
import Either from "../utils/Either.js";

export class OrderGameRepository extends IOrderGame {
  async saveOrderGame(idGame, type) {
    const newOrder = await db.OrderGame.create({ id_game: idGame, order_game: type });
    return Either.right(newOrder);
  }

  async getOrdersByGame(idGame) {
    const orders = await db.OrderGame.findOne({
      where: { id_game: idGame },
    });
    if(!orders){
        return Either.left({ message: "Not match order of game", statusCode: 404 });
    }
    return Either.right(orders);
  }

  async updateOrderGame(idGame, order) {
    try{
        const updatedOrder = await db.OrderGame.update(
            {order_game: order},
            {where:{id_game:idGame}}
          );
          return Either.right(updatedOrder);
    }catch(error){
        return Either.left({ message: error.message, statusCode: 500 });
    }
  }
}