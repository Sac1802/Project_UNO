import jwt from "jsonwebtoken";

export async function generateToken(id) {
  return jwt.sign({ playerId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
}