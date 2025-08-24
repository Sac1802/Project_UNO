import player from "../models/player.js";
import Either from "../utils/Either.js";

export class ScoreService {
  constructor(scoreRepo) {
    this.scoreRepo = scoreRepo;
  }

  async saveScore(scoreData) {
    const savedScore = await this.scoreRepo.saveScore(scoreData);

    if (savedScore.isLeft()) {
      return Either.left({
        message: "Score could not be created",
        statusCode: 500,
      });
    }

    return Either.right({
      message: "Score registered successfully",
      score: savedScore.value,
    });
  }

  async getAllScore() {
    const scores = await this.scoreRepo.getAllScore();

    if (scores.isLeft()) {
      return Either.left({
        message: "Scores cannot be obtained",
        statusCode: 404,
      });
    }

    return scores;
  }

  async getById(id) {
    const scoreById = await this.scoreRepo.getById(id);

    if (scoreById.isLeft()) {
      return Either.left({
        message: `The score with id ${id} does not exist`,
        statusCode: 404,
      });
    }

    return scoreById;
  }

  async updateAll(newData, id) {
    const scoreById = await this.scoreRepo.getById(id);

    if (scoreById.isLeft()) {
      return Either.left({
        message: `The score with id ${id} does not exist`,
        statusCode: 404,
      });
    }

    const updatedScore = await this.scoreRepo.updateAll(newData, id);

    if (updatedScore.isLeft()) {
      return Either.left({
        message: "Score cannot be updated",
        statusCode: 500,
      });
    }

    return updatedScore;
  }

  async deleteById(id) {
    const scoreById = await this.scoreRepo.getById(id);

    if (scoreById.isLeft()) {
      return Either.left({
        message: `The score with id ${id} does not exist`,
        statusCode: 404,
      });
    }

    const deleted = await this.scoreRepo.deleteById(id);

    if (deleted.isLeft()) {
      return Either.left({
        message: "Error deleting score",
        statusCode: 500,
      });
    }

    return Either.right({ message: "Score deleted successfully" });
  }

  async patchScore(newData, id) {
    const scoreById = await this.scoreRepo.getById(id);

    if (scoreById.isLeft()) {
      return Either.left({
        message: `The score with id ${id} does not exist`,
        statusCode: 404,
      });
    }

    const updatedScore = await this.scoreRepo.patchScore(newData, id);

    if (updatedScore.isLeft()) {
      return Either.left({
        message: "Error updating score",
        statusCode: 500,
      });
    }

    return updatedScore;
  }

  async scoreAllPlayers(idGame) {
    const findScoreByGame = await this.scoreRepo.getAllScore({
      where: {
        gameId: idGame,
      },
      include: {
        model: player,
        attributes: ["username"],
      },
    });

    if (findScoreByGame.isLeft()) {
      return Either.left({
        message: `The game with id ${idGame} has no scores`,
        statusCode: 404,
      });
    }

    const scores = findScoreByGame.value;

    if (!scores || scores.length === 0) {
      return Either.left({
        message: `The game with id ${idGame} does not correspond to any stored`,
        statusCode: 404,
      });
    }

    const scoreObject = {};
    scorePlayers.forEach((p) => {
      scoreObject[p.username] = p.score;
    });

    return Either.right({ scores: scoreObject });
  }
}
