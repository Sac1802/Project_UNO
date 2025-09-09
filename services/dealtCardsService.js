import Either from "../utils/Either.js";

export class PlayCarService {
  constructor(
    repoGame,
    repoMacher,
    repoCards,
    repoPlayer,
    repoCardsPlayer,
    repoTurnHis,
    repoOrder
  ) {
    this.repoGame = repoGame;
    this.repoMacher = repoMacher;
    this.repoCards = repoCards;
    this.repoPlayer = repoPlayer;
    this.repoCardsPlayer = repoCardsPlayer;
    this.repoTurnHis = repoTurnHis;
    this.repoOrder = repoOrder;
  }

  async dealtCard(gameId, maxCardsPerPlayer) {
    
    const playersAndCards = [];
    const validation = await this.validateGameAndCards(gameId);
    if (validation.isLeft()) return validation;

    const cardsMap = validation.right.cardsMap;
    const players = await this.repoMacher.getPlayers(gameId);
    await Promise.all(
      players.right.map(async (player) => {
        const playerData = await this.repoPlayer.getByIdPlayer(player.id_player);
        let deckPlayers = [];

        const result = await this.createDeckPerPlayer(
          cardsMap,
          maxCardsPerPlayer,
          playerData.name,
          deckPlayers
        );

        const deckPerPlayer = {
          player: result.player,
          cards: result.cards,
        };

        const resultPlayer = await this.repoCardsPlayer.savePlayerInGame({
          id_game: gameId,
          id_player: player.id_player,
          cardsPlayer: deckPerPlayer,
        });
        playersAndCards.push(deckPerPlayer);
      })
    );
  
    return Either.right({
      message: "Cards dealt successfully",
      player: playersAndCards,
    });
  }

  async saveNewTurn(gameId, action, playerId, cards) {
    const validation = await this.validateGame(gameId);
    if (validation.isLeft()) return validation;
    const actionSave =
      action === "play"
        ? `Played ${cards.color} ${cards.value}`
        : `Drew a card`;

    await this.repoTurnHis.saveHistoryTurn(actionSave, gameId, playerId);
  }

  async validateGameAndCards(gameId) {
    const findGame = await this.repoGame.getById(gameId);
    if (findGame.isLeft()) return Either.left("game not found");
    if (findGame.right.status != "in_progress") {
      return Either.left("game is not in progress");
    } else {
      const cardsEither = await this.repoCards.getCardByIdgame(gameId);
      if (cardsEither.isLeft()) return cardsEither;
      const cardsMap = await this.createSetCards(cardsEither.right);
      return Either.right({ cardsMap });
    }
  }

  async createSetCards(cards) {
    const setCards = new Map();
    cards.forEach((card) => {
      setCards.set(card.id, card);
    });
    return setCards;
  }

  async validateGame(gameId) {
    const findGame = await this.repoGame.getById(gameId);
    if (findGame.isLeft()) {
      return Either.left("game not found");
    }
    if (findGame.right.status != "in_progress")
      return Either.left("game is not in progress");
    return Either.right(findGame);
  }

  async createDeckPerPlayer(cardsList, maxCardsPerPlayer, player, deckPlayers) {
    if (maxCardsPerPlayer === 0)
      return { player: player, cards: deckPlayers, list: cardsList };

    const cardId = this.getRandomCard(cardsList);
    const card = cardsList.get(cardId);
    await this.repoCards.updateDiscardCard(card.id);
    deckPlayers.push(card);
    cardsList.delete(cardId);
    return this.createDeckPerPlayer(
      cardsList,
      maxCardsPerPlayer - 1,
      player,
      deckPlayers
    );
  }

  getRandomCard(listCards) {
    const keys = Array.from(listCards.keys());
    const randomIndex = Math.floor(Math.random() * keys.length);
    return keys[randomIndex];
  }

  async playCard(idPlayer, cardId, gameId) {
    const validation = await this.validatePlay(idPlayer, cardId, gameId);
    if (validation.isLeft()) return validation;

    const card = await this.repoCards.updateDiscardCard(cardId);
    await this.repoCardsPlayer.deleteACardByIdPlayer(gameId, idPlayer, cardId);

    const nextPlayer = await this.getNextPlayer(gameId, idPlayer);
    await this.repoGame.updateCurrentPlayer(gameId, nextPlayer.id);
    this.saveNewTurn(gameId, "play", idPlayer, card);

    return Either.right({
      message: "Card played successfully",
      nextPlayer: nextPlayer.name,
    });
  }

  async validatePlay(idPlayer, cardId, gameId) {
    const player = await this.repoPlayer.getByIdPlayer(idPlayer);
    if (!player) return Either.left("player not found");

    const findCard = await this.repoCards.getByIdCard(cardId);
    if (!findCard) return Either.left("card not found");
    const topCard = await this.repoCards.topCard(gameId);
    if (
      topCard.right.color !== findCard.color &&
      topCard.right.value !== findCard.value
    ) {
      return Either.left({
        message:
          "Invalid card. Please play a card that matches the top card on the discard pile.",
        statusCode: 400,
      });
    }
    return Either.right(findCard);
  }

  async getNextPlayer(idGame, actualPlayerId) {
    const curretOrder = await this.repoOrder.getOrdersByGame(idGame);
    const players = null;
    if (curretOrder.right.order === "clockwise") {
      players = await this.repoMacher.getPlayersAsc(idGame);
    } else {
      players = await this.repoMacher.getPlayersDesc(idGame);
    }

    const currentIndex = players.findIndex((p) => p.id === actualPlayerId);
    return players[(currentIndex + 1) % players.length];
  }

  async drawCard(idPlayer, gameId) {
    const findCards = await this.repoCards.getCardByIdgame(gameId);
    if (findCards.isLeft()) return findCards;

    const cardArray = findCards.right;
    const cardIndex = Math.floor(Math.random() * cardArray.length);
    const card = cardArray[cardIndex];

    await this.repoCards.updateDiscardCard(card.id);

    await this.saveNewTurn(gameId, "draw", idPlayer, card);

    

    const deckPlayersEither = await this.repoCardsPlayer.getCardsByIdPlayer(
      gameId,
      idPlayer
    );
    console.log(deckPlayersEither);
    if (deckPlayersEither.isLeft()) return deckPlayersEither;

    const cardPlain = {
      id: card.id,
      color: card.color,
      value: card.value,
      gameId: card.gameId,
      isDiscarded: card.isDiscarded,
      createdAt: card.createdAt,
    };

    const rawCards = deckPlayersEither.right.cardsPlayer;

    let deckPlayersObj;
    if (!rawCards) {
      deckPlayersObj = { cards: [] };
    } else if (typeof rawCards === "string") {
      deckPlayersObj = JSON.parse(rawCards);
    } else {
      deckPlayersObj = rawCards;
    }

    const deckPlayersArray = deckPlayersObj.cards || [];

    deckPlayersArray.push(cardPlain);

    await this.repoCardsPlayer.updateCardsByIdPlayer(gameId, idPlayer, {
      cards: deckPlayersArray,
    });

    const player = await this.repoPlayer.getByIdPlayer(idPlayer);

    return Either.right({
      message: `${player.right.username} drew a card from the deck`,
      cardDrawn: { color: card.color, value: card.value },
    });
  }

  async sayUno(idPlayer, idGame) {
    const validatePlayerInGame = await this.repoMacher.findOne(
      idGame,
      idPlayer
    );
    if (!validatePlayerInGame) {
      return Either.left("player not found");
    }

    const mallet = await this.repoCardsPlayer.getCardsByIdPlayer(
      idGame,
      idPlayer
    );
    if (mallet.isLeft()) return mallet;
    const player = await this.repoPlayer.getByIdPlayer(idPlayer);
    if (mallet.right.cardsPlayer.length === 1) {
      return Either.right(
        `Player ${player.right.username} said UNO successfully.`
      );
    }

    return Either.left(
      {message: `Player ${player.right.username} does not have exactly one card.`, statusCode: 400}
    );
  }

  *unoMonitor(cards) {
    for (const card of cards) {
      yield card;
    }
    if (cards.length === 1) {
      yield "UNO";
    }
  }

  async challengerSayUno(idPlayerChallenger, idPlayerDefender, idGame) {
    const defender = await this.repoMacher.findOne(idGame, idPlayerDefender);
    if (!defender) {
      return Either.left("Defender not found in game.");
    }

    const playerCards = await this.repoCardsPlayer.getCardsByIdPlayer(
      idGame,
      idPlayerDefender
    );
    if (playerCards.isLeft()) {
      return playerCards;
    }

    const monitor = this.unoMonitor(playerCards.right.cardsPlayer);
    let sayUno = false;
    [...monitor].forEach((values) => {
      if (values == "UNO") {
        sayUno = true;
      }
    });

    if (sayUno && playerCards.right.cardsPlayer.length === 1) {
      const nextPlayer = await this.getNextPlayer(idGame, idPlayerChallenger);
      this.repoGame.updateCurrentPlayer(idGame, nextPlayer.id);
      return Either.right({
        message: `Challenge successful. ${defender.name} forgot to say UNO and draws 2 cards.`,
        nextPlayer: nextPlayer.name,
      });
    }

    return Either.left({
      message: `Challenge failed. ${defender.name} said UNO on time.`,
    });
  }

  async finishGame(idGame, idPlayer) {
    const cards = await this.repoCardsPlayer.getCardsByIdPlayer(
      idGame,
      idPlayer
    );
    const player = await this.repoPlayer.getByIdPlayer(idPlayer);

    const score = cards.right.cardsPlayer.reduce(
      (acc, card) => acc + parseInt(card.value),
      0
    );

    const playersGame = await this.repoMacher.getPlayers(idGame);

    if (cards.right.cardsPlayer.length === 0) {
      await this.repoGame.endGame("finished", idGame);
      return Either.right({
        message: `${player.name} has won the game!`,
        scores: playersGame.map((p) => `${p.name}: ${score}`).join(", "),
      });
    }

    const currentIndex = playersGame.findIndex((p) => p.id === idPlayer);
    const nextPlayer = playersGame[(currentIndex + 1) % playersGame.length];

    return this.finishGame(idGame, nextPlayer.id);
  }

  async getGameStatus(idGame) {
    const currentPlayer = await this.repoGame.getCurrentPlayer(idGame);
    const historyTurn = await this.repoTurnHis.getHistoryTurnsByGameId(idGame);
    const cardTop = await this.repoCards.topCard(idGame);
    const playerCards = await this.repoCardsPlayer.getAllPlayersInGame(idGame);

    const hands = {};
    for (const p of playerCards.right) {
      const player = await this.repoPlayer.getByIdPlayer(p.id_player);
      hands[player.name] = p.cardsPlayer.map((c) => `${c.color} ${c.value}`);
    }

    return Either.right({
      currentPlayer: currentPlayer.right.value,
      topCard: cardTop.right.value,
      hands,
      turnHistory: historyTurn.right.turn_history,
    });
  }

  async getCardsPlayer(idGame, idPlayer) {
    const playerCards = await this.repoCardsPlayer.getCardsByIdPlayer(
      idGame,
      idPlayer
    );
    if (playerCards.isLeft()) return playerCards;

    const player = await this.repoPlayer.getByIdPlayer(idPlayer);

    const cardsObj = JSON.parse(playerCards.right.cardsPlayer);
    const cardsArray = cardsObj.cards || [];

    const handsValue = {
      player: player.name,
      hand: cardsArray.map((c) => `${c.color} ${c.value}`),
    };

    return Either.right({ handsValue });
  }

  async getHistory(idGame) {
    const history = await this.repoTurnHis.getHistoryTurnsByGameId(idGame);
    if (history.isLeft()) return history;

    return Either.right({ history: history.right });
  }
}
