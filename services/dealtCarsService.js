import game from "../models/games";
import player from "../models/player";
import Either from "../utils/Either";

export class PlayCarService {
  constructor(repoGame, repoMacher, repoCards, repoPlayer) {
    this.repoGame = repoGame;
    this.repoMacher = repoMacher;
    this.repoCards = repoCards;
    this.repoPlayer = repoPlayer;
  }

  async dealtCard(gameId, maxCardsPerPlayer) {
    const playersAndCards = [];
    const validation = await this.validateGameAndCards(gameId);
    if (validation.isLeft()) return validation;
    const findPlayer = await this.repoMacher.getPlayers(gameId);
    for (const player of findPlayer) {
      const NamePlayer = this.repoPlayer.getByIdPlayer(player.id_player);
      let deckPlayers = [];
      const result = await this.createDeckPerPlayer(
        cardsMap,
        maxCardsPerPlayer,
        NamePlayer.name,
        deckPlayers
      );
      const deckPerPlayer = {
        player: result.player,
        cards: result.cards,
      };
      playersAndCards.push(deckPerPlayer);
    }
    return new Either.right({
      message: "Cards dealt successfully",
      player: playersAndCards,
    });
  }

  async validateGameAndCards(gameId) {
    const findGame = await this.repoGame.getById(gameId);
    if (!findGame) return new Either.left("game not found");
    if (findGame.status != "in_progress") {
      return new Either.left("game is not in progress");
    } else {
      const cards = await this.repoCards.getCardByIdgame(gameId);
      if (cards.isLeft()) return new Either.left("no cards available");
      return new Either.right(findGame);
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
    if (!findGame) {
      return new Either.left("game not found");
    }
    if (findGame.status != "in_progress")
      return new Either.left("game is not in progress");
    return new Either.right(findGame);
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

    await this.repoCards.updateDiscardCard(cardId);

    const nextPlayer = await this.getNextPlayer(gameId, idPlayer);
    await this.repoGame.updateCurrentPlayer(gameId, nextPlayer.id);

    return new Either.right({
      message: "Card played successfully",
      nextPlayer: nextPlayer.name,
    });
  }

  async validatePlay(idPlayer, cardId, gameId) {
    const player = await this.repoPlayer.getByIdPlayer(idPlayer);
    if (!player) return new Either.left("player not found");

    const findCard = await this.repoCards.getByIdCard(cardId);
    if (!findCard) return new Either.left("card not found");

    const topCard = await this.repoCards.topCard(gameId);
    if (
      topCard.right.color !== findCard.color &&
      topCard.right.value !== findCard.value
    ) {
      return new Either.left(
        "Invalid card. Please play a card that matches the top card on the discard pile."
      );
    }

    return new Either.right(findCard);
  }

  async getNextPlayer(idGame, actualPlayerId) {
    const players = await this.repoMacher.getPlayers(idGame);
    const currentIndex = players.findIndex((p) => p.id === actualPlayerId);
    return players[(currentIndex + 1) % players.length];
  }

  async drawCard(idPlayer, gameId) {
    const findCarts = await this.repoCards.getCardByIdgame(gameId);
    const cardsId = await this.getRandomCard(findCarts.right);
    const card = findCarts.get(cardsId);
    const player = await this.repoPlayer.getByIdPlayer(idPlayer);
    await this.repoCards.updateDiscardCard(card.id);
    return new Either.right({
      message: `${player.name} drew a card from the desck`,
      cardDrawn: { color: card.color, value: card.value },
    });
  }

  async sayUno(idPlayer, mallet, idGame) {
    const validatePlayerInGame = await this.repoMacher.findOne(
      idGame,
      idPlayer
    );
    if (!validatePlayerInGame) {
      return new Either.left("player not found");
    }

    function* checkUno(cards) {
      for (const card of cards) {
        yield card;
      }
      if (cards.length === 1) {
        yield "UNO";
      }
    }
    const unoGenerator = checkUno(mallet);
    let result;
    for (let val of unoGenerator) {
      if (val === "UNO") {
        result = `Player ${idPlayer} said UNO successfully.`;
      }
    }

    if (result) {
      return new Either.right(result);
    }
    return new Either.left(`Player ${idPlayer} did not say UNO.`);
  }
}
