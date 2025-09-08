import Either from "../utils/Either.js";

export class RulesService {
  constructor(matchRepo, gameRepo, orderRepo, playerInGame, cardRepo) {
    this.matchRepo = matchRepo;
    this.gameRepo = gameRepo;
    this.orderRepo = orderRepo;
    this.playerInGame = playerInGame;
    this.cardRepo = cardRepo;
  }

  async nextTurn(idGame) {
    const currentPlayer = await this.gameRepo.getCurrentPlayer(idGame);
    if (currentPlayer.isLeft()) {
      return currentPlayer;
    }

    const playersInGame = await this.matchRepo.getPlayersId(idGame);
    const indexPlayer = playersInGame.right.findIndex(
      (player) => player.id === currentPlayer.right
    );
    const nextIndex = (indexPlayer + 1) % playersInGame.right.length;
    await this.gameRepo.updateCurrentPlayer(
      idGame,
      playersInGame.right[nextIndex].id
    );
    const result = {
      body: {
        nextPlayerIndex: nextIndex,
        nextPlayer: playersInGame.right[nextIndex].username,
      },
    };

    return Either.right(result);
  }

  async skipPlayer(idGame, cardId) {
    const currentPlayer = await this.gameRepo.getCurrentPlayer(idGame);
    if (currentPlayer.isLeft()) {
      return currentPlayer;
    }

    const players = await this.playerInGame.getAllPlayersInGame(idGame);

    const filterPlayer = players.right.filter((player) => {
      const cards = JSON.parse(player.cardsPlayer).cards;
      return cards.some((card) => card.id === cardId);
    });
    if (filterPlayer.length === 0) {
      return Either.left({ message: "The card is not in the player's deck" });
    }

    const playersInGame = await this.matchRepo.getPlayersId(idGame);
    const indexPlayer = playersInGame.right.findIndex(
      (player) => player.id === currentPlayer.right
    );

    const skippedIndex = (indexPlayer + 1) % playersInGame.right.length;
    const skippedPlayer = playersInGame.right[skippedIndex];
    const nextIndex = (indexPlayer + 2) % playersInGame.right.length;
    const nextPlayer = playersInGame.right[nextIndex];
    await this.gameRepo.updateCurrentPlayer(idGame, nextPlayer.id);
    const result = {
      body: {
        nextPlayerIndex: nextIndex,
        nextPlayer: nextPlayer.username,
        skippedPlayer: skippedPlayer.username,
      },
    };

    return Either.right(result);
  }

  async reverseOrder(idGame) {
    const currentPlayer = await this.gameRepo.getCurrentPlayer(idGame);
    if (currentPlayer.isLeft()) return currentPlayer;
    const orderPlayers = await this.orderRepo.getOrdersByGame(idGame);
    const order = orderPlayers.right.order_game;

    let newDirection;
    let playersInGame;

    if (order === "clockwise") {
      await this.orderRepo.updateOrderGame(idGame, "counterclockwise");
      newDirection = "counterclockwise";
      playersInGame = (await this.matchRepo.getPlayersAsc(idGame)).right
        .map((p) => p)
        .reverse();
    } else {
      await this.orderRepo.updateOrderGame(idGame, "clockwise");
      newDirection = "clockwise";
      playersInGame = (await this.matchRepo.getPlayersAsc(idGame)).right;
    }
    const indexPlayer = playersInGame.findIndex(
      (player) => player.id === currentPlayer.right
    );
    const nextIndex = (indexPlayer + 1) % playersInGame.length;
    const nextPlayer = playersInGame[nextIndex];
    await this.gameRepo.updateCurrentPlayer(idGame, nextPlayer.id);
    const result = {
      body: {
        nextPlayerIndex: nextIndex,
        nextPlayer: nextPlayer.username,
        newDirection: newDirection,
      },
    };

    return Either.right(result);
  }
}
