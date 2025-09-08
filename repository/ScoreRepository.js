import db from "../models/index.js";
import { IScoreRepository } from "../interfaces/IScoreRepository.js";
import Either from "../utils/Either.js";

export class ScoreRepository extends IScoreRepository {
  async saveScore(data) {
    const savedScore = await db.score.create(data);
    if (!savedScore) {
      return Either.left({
        message: `The score could not be created`,
        statusCode: 500,
      });
    }
    return Either.right(savedScore);
  }

  async getAllScore(options = {}) {
    const scores = await db.score.findAll(options);
    if (!scores || scores.length === 0) {
      return Either.left({
        message: `No scores found`,
        statusCode: 404,
      });
    }
    return Either.right(scores);
  }

  async getById(id) {
    const scoreInstance = await db.score.findByPk(id);
    if (!scoreInstance) {
      return Either.left({
        message: `No score found with id ${id}`,
        statusCode: 404,
      });
    }
    return Either.right(scoreInstance);
  }

  async updateAll(newData, id) {
    const scoreInstance = await db.score.findByPk(id);
    if (!scoreInstance) {
      return Either.left({
        message: `No score found with id ${id}`,
        statusCode: 404,
      });
    }
    Object.assign(scoreInstance, newData);
    const updated = await scoreInstance.save();
    return Either.right(updated);
  }

  async deleteById(id) {
    const deleted = await db.score.destroy({ where: { id } });
    if (!deleted) {
      return Either.left({
        message: `No score found with id ${id} to delete`,
        statusCode: 404,
      });
    }
    return Either.right(deleted);
  }

  async patchScore(newData, id) {
    const scoreInstance = await db.score.findByPk(id);
    if (!scoreInstance) {
      return Either.left({
        message: `No score found with id ${id}`,
        statusCode: 404,
      });
    }
    const updated = await scoreInstance.update(newData);
    return Either.right(updated);
  }
}
