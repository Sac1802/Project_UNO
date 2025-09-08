import sequelize from "../db/db.js";
import player from "./player.js";
import game from "./games.js";
import card from "./cards.js";
import gameFast from "./gameFast.js";
import match from "./match.js";
import OrderGame from "./orderGame.js";
import playerInGame from "./playerInGame.js";
import score from "./score.js";
import turnHistory from "./turnHistory.js";
import usageTracking from "./usageTracking.js";

player.hasMany(game, {foreignKey: 'game_owner'});
game.belongsTo(player, {foreignKey: 'game_owner'});

player.hasMany(game, { foreignKey: 'current_turn_player_id', as: 'turnGames' });
game.belongsTo(player, { foreignKey: 'current_turn_player_id', as: 'currentPlayer' });

game.hasMany(card, {foreignKey: 'gameId', onDelete: 'CASCADE', hooks: true});
card.belongsTo(game, {foreignKey: 'gameId'});

player.hasMany(gameFast, {foreignKey: 'game_owner'});
gameFast.belongsTo(player, {foreignKey: 'game_owner'});

player.hasMany(gameFast, { foreignKey: 'current_turn_player_id', as: 'turnGamesFast' });
gameFast.belongsTo(player, { foreignKey: 'current_turn_player_id', as: 'currentPlayerFast' });

game.hasMany(match, {
  foreignKey: "id_game",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
match.belongsTo(game, {
  foreignKey: "id_game",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

player.hasMany(match, {
  foreignKey: "id_player",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
match.belongsTo(player, {
  foreignKey: "id_player",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

game.hasMany(OrderGame, {
  foreignKey: "id_game",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
OrderGame.belongsTo(game, {
  foreignKey: "id_game",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

game.hasMany(playerInGame, { foreignKey: "id_game", onDelete: "CASCADE" });
playerInGame.belongsTo(game, { foreignKey: "id_game" });

player.hasMany(playerInGame, { foreignKey: "id_player", onDelete: "CASCADE" });
playerInGame.belongsTo(player, { foreignKey: "id_player" });

player.hasMany(score,  {foreignKey: 'playerId', onDelete: 'CASCADE', hooks: true});
score.belongsTo(player, {foreignKey: 'playerId'});

game.hasMany(score, {foreignKey: 'gameId', onDelete: 'CASCADE', hooks: true});
score.belongsTo(game, {foreignKey: 'gameId'});


game.hasMany(turnHistory, {
  foreignKey: "game_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
turnHistory.belongsTo(game, {
  foreignKey: "game_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

player.hasMany(turnHistory, {
  foreignKey: "player_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
turnHistory.belongsTo(player, {
  foreignKey: "player_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

player.hasMany(usageTracking, {foreignKey: "userId"});
usageTracking.belongsTo(player, {foreignKey: "userId"});


const db = {
    sequelize,
    player,
    game,
    card,
    gameFast,
    match,
    OrderGame,
    playerInGame,
    score,
    turnHistory,
    usageTracking
};

export default db;