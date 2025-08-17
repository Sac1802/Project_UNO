import bcrypt from 'bcrypt'

async function encryptPassword(password) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

export async function comparePasswords(password, hash) {
  return await bcrypt.compare(password, hash);
}

export default {
  encryptPassword,
  comparePasswords
};