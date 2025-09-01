import Either from "../utils/Either";

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

    const players = await this.matchRepo.listUser(idGame);

    const filterPlayer = players.right.filter((player) =>
      player.deckPerPlayer.cards.some((card) => card.id === cardId)
    );
    if (filterPlayer.length === 0) {
      return Either.left({ message: "Not found player" });
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
    const order = orderPlayers.right.order;

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

  async cardPlay(idGame, playerId) {
    const currentCards = await this.playerInGame.getCardsByIdPlayer(
      idGame,
      playerId
    );
    if (currentCards.isLeft()) return currentCards;

    const cards = await this.cardRepo.getCardByIdgame(idGame);
    if (cards.isLeft()) return cards;

    const cartTop = await this.cardRepo.topCard(idGame);
    if (cartTop.isLeft()) return cartTop;

    let newHands = [...currentCards.right];

    for (const cardNotUsed of cards.right) {
      newHands.push(cardNotUsed);

      if (
        cardNotUsed.color === cartTop.right.color ||
        cardNotUsed.value === cartTop.right.value
      ) {
        const newHandsValues = [...currentCards.right, cardNotUsed];
        await this.playerInGame.updateCardsByIdPlayer(
          idGame,
          playerId,
          newHandsValues
        );

        const result = {
          body: {
            newHand: newHands.map((c) => `${c.color}_${c.value}`),
            drawnCard: `${cardNotUsed.color}_${cardNotUsed.value}`,
            playable: true,
          },
        };
        return Either.right(result);
      }
    }

    const playersInGame = await this.matchRepo.getPlayersId(idGame);
    const indexPlayer = playersInGame.right.findIndex(
      (player) => player.id === playerId
    );
    const nextIndex = (indexPlayer + 1) % playersInGame.right.length;

    await this.gameRepo.updateCurrentPlayer(
      idGame,
      playersInGame.right[nextIndex].id
    );

    return Either.left(
      `There is no playable card. Turn passes to: ${playersInGame.right[nextIndex].username}.`
    );
  }
}
