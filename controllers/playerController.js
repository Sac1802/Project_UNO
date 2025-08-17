import { PlayerService } from "../services/playerService.js";
import { PlayerRepository } from "../repository/playerRepository.js";

const playerRepo = new PlayerRepository();
const playerService = new PlayerService(playerRepo);

export async function createPlayer(req, res, next) {
  const playerData = req.body;

  if (validateInputPlayer(playerData)) {
    return res.status(400).json({ error: "All fields must be completed" });
  }

  const result = await playerService.savePlayer(playerData);

  if (result.isRight()) {
    return res.status(201).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getPlayers(req, res, next) {
  const result = await playerService.getPlayers();

  if (result.isRight()) {
    return res.status(200).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getByIdPlayer(req, res, next) {
  const id = req.params.id;
  const result = await playerService.getByIdPlayer(id);

  if (result.isRight()) {
    return res.status(200).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 404).json({ error: err.message });
  }
}

export async function updateFullPlayer(req, res, next) {
  const dataUpdate = req.body;
  const id = req.params.id;

  if (validateInputPlayer(dataUpdate)) {
    return res.status(400).json({ error: "All fields must be completed" });
  }

  const result = await playerService.updateFullPlayer(dataUpdate, id);

  if (result.isRight()) {
    return res.status(200).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function deletePlayer(req, res, next) {
  const id = req.params.id;
  const result = await playerService.deletePlayer(id);

  if (result.isRight()) {
    return res.status(204).send();
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function patchPlayer(req, res, next) {
  const dataPlayerUpdate = req.body;
  const id = req.params.id;

  const result = await playerService.patchPlayer(dataPlayerUpdate, id);

  if (result.isRight()) {
    return res.status(200).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

export async function getPlayerByToken(req, res, next) {
  const idPlayer = req.user?.playerId;
  if (!idPlayer) {
    return res.status(400).json({ message: "Player ID is required" });
  }

  const result = await playerService.getByIdByToken(idPlayer);

  if (result.isRight()) {
    return res.status(200).json(result.value);
  } else {
    const err = result.getError();
    return res.status(err.statusCode || 404).json({ error: err.message });
  }
}

function validateInputPlayer(data) {
  if (!data || Object.keys(data).length === 0) return true;
  return Object.values(data).some(
    (val) => val === null || val === undefined || val === ""
  );
}
