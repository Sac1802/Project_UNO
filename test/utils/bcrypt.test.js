import bcryptModule, { comparePasswords } from '../../utils/bcrypt.js';

describe('Bcrypt Module', () => {
  const passwordMalenia = 'malenia';
  const passwordMarika = 'marika';

  describe('encryptPassword', () => {
    it('should return a hashed password different from the plain password', async () => {
      const hash = await bcryptModule.encryptPassword(passwordMalenia);
      expect(hash).not.toBe(passwordMalenia);
      expect(typeof hash).toBe('string');
    });
  });

  describe('comparePasswords', () => {
    it('should return true if password matches the hash', async () => {
      const hash = await bcryptModule.encryptPassword(passwordMalenia);
      const result = await comparePasswords(passwordMalenia, hash);
      expect(result).toBe(true);
    });

    it('should return false if password does not match the hash', async () => {
      const hash = await bcryptModule.encryptPassword(passwordMalenia);
      const result = await comparePasswords(passwordMarika, hash);
      expect(result).toBe(false);
    });
  });
});
