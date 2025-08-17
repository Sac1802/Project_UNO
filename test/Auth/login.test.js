import * as blackListToken from "../../utils/blackListToken.js";
import player from "../../models/player.js";
import bcrypt from "../../utils/bcrypt.js";
import { LoginService } from "../../services/loginService.js";
import { generateToken } from "../../utils/generateToken.js";

jest.mock("../../models/player.js");
jest.mock("../../utils/bcrypt.js");
jest.mock("../../utils/generateToken.js");
jest.mock("../../utils/blackListToken.js");

describe("LoginService", () => {
  let loginService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
    process.env.JWT_EXPIRES = "1h";
    loginService = new LoginService(player);
  });

  describe("loginUser", () => {
    test("Return a JWT token when credentials are valid", async () => {
      player.findOne.mockResolvedValue({ id: 1, password: "hashedPassword" });
      bcrypt.compare.mockResolvedValue(true);
      generateToken.mockResolvedValue("mockedToken");

      const response = await loginService.loginUser({ username: "lobo", password: "1234" });

      expect(player.findOne).toHaveBeenCalledWith("lobo");
      expect(bcrypt.compare).toHaveBeenCalledWith("1234", "hashedPassword");
      expect(response.isRight()).toBe(true);
      expect(response.right).toEqual({ access_token: "mockedToken" });
    });

    test("Throw error when username does not exist", async () => {
      player.findOne.mockResolvedValue(null);

      await expect(
        loginService.loginUser({ username: "unknown", password: "1234" })
      ).rejects.toThrow("Invalid Credentials");
    });

    test("Throw error when password is incorrect", async () => {
      player.findOne.mockResolvedValue({ id: 1, password: "hashedPassword" });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        loginService.loginUser({ username: "lobo", password: "wrong" })
      ).rejects.toThrow("Invalid Credentials");
    });
  });

  describe("logoutUser", () => {
    test("Should revoke token if not revoked", async () => {
      blackListToken.isTokenRevoked.mockResolvedValue(false);

      const result = await loginService.logoutUser("tokenInvalid");

      expect(blackListToken.revokeToken).toHaveBeenCalledWith("tokenInvalid");
      expect(result).toEqual({ message: "User logged out successfully" });
    });

    test("Should not revoke token if already revoked", async () => {
      blackListToken.isTokenRevoked.mockResolvedValue(true);

      const result = await loginService.logoutUser("tokenInvalid");

      expect(blackListToken.revokeToken).not.toHaveBeenCalled();
      expect(result).toEqual({ error: "The token is not valid or already revoked" });
    });
  });
});
