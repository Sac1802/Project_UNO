import { ScoreService } from "../services/scoreService.js";
import { ScoreRepository } from "../repository/ScoreRepository.js";

const scoreRepo = new ScoreRepository();
const scoreService = new ScoreService(scoreRepo);

export async function saveScore(req, res, next) {
  const data = req.body;

  if (validateInputScore(data)) {
    return res.status(400).json({ error: "All fields must be completed" });
  }

  const result = await scoreService.saveScore(data);

  if (result.isRight()) {
    return res.status(201).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getAllScore(req, res, next) {
  const result = await scoreService.getAllScore();

  if (result.isRight()) {
    return res.status(200).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 404).json({ error: err.message });
  }
}

export async function getById(req, res, next) {
  const id = req.params.id;
  const result = await scoreService.getById(id);

  if (result.isRight()) {
    return res.status(200).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 404).json({ error: err.message });
  }
}

export async function updateAllScore(req, res, next) {
  const dataUpdated = req.body;
  const id = req.params.id;

  if (validateInputScore(dataUpdated)) {
    return res.status(400).json({ error: "All fields must be completed" });
  }

  const result = await scoreService.updateAll(dataUpdated, id);

  if (result.isRight()) {
    return res.status(200).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function deleteById(req, res, next) {
  const id = req.params.id;
  const result = await scoreService.deleteById(id);

  if (result.isRight()) {
    return res.status(204).send();
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function patchScore(req, res, next) {
  const newData = req.body;
  const id = req.params.id;

  const result = await scoreService.patchScore(newData, id);

  if (result.isRight()) {
    return res.status(200).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getScoreAllPlayer(req, res, next) {
  const { idGame } = req.body;
  if (!idGame) {
    return res.status(400).json({ error: "Game ID is required" });
  }

  const result = await scoreService.scoreAllPlayers(idGame);

  if (result.isRight()) {
    return res.status(200).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 404).json({ error: err.message });
  }
}

function validateInputScore(data) {
  if (!data || Object.keys(data).length === 0) return true;
  return Object.values(data).some(
    (val) => val === null || val === undefined || val === ""
  );
}
