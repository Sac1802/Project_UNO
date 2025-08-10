import * as blackListToken from "../../utils/blackListToken.js";
import * as player from "../../models/player.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  loginUser,
  getUserById,
  logoutUser,
} from "../../services/loginService";

jest.mock("../../models/player.js", () => ({
  findOne: jest.fn(),
  findByPk: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("../../utils/blackListToken.js", () => ({
  revokeToken: jest.fn(),
  isTokenRevoked: jest.fn(),
}));

describe("loginService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret";
    process.env.JWT_EXPIRES = "1h";
  });

  test("Return a JWT token when credentials are valid", async () => {
    player.findOne.mockResolvedValue({ id: 1, password: "hashedPassword" });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockedToken");

    const response = await loginUser({ username: "lobo", password: "1234" });

    expect(player.findOne).toHaveBeenCalledWith({
      where: { username: "lobo" },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith("1234", "hashedPassword");
    expect(response.isRight()).toBe(true);
    expect(response.right).toEqual({ access_token: "mockedToken" });
  });

  test("Should not revoke token if already revoked", async () => {
    blackListToken.isTokenRevoked.mockReturnValue(true);

    const result = await logoutUser("tokenInvalid");

    expect(blackListToken.revokeToken).not.toHaveBeenCalled();
    expect(result).toEqual({
      error: "The token is not valid or already revoked",
    });
  });

  test("Should return user if exist", async () => {
    const user = { id: 1, username: "lobo" };
    player.findByPk.mockResolvedValue(user);

    const result = await getUserById(1);

    expect(player.findByPk).toHaveBeenCalledWith(1);
    expect(result.isRight()).toBe(true);
    expect(result.right).toEqual(user);
  });

  test("should throw error if user not found", async () => {
    player.findByPk.mockRejectedValue(new Error("DB error"));

    await expect(getUserById(999)).rejects.toThrow(
      "The user with 999 not exists"
    );
  });

  test("Throw error when username does not exist", async () => {
    player.findOne.mockResolvedValue(null);

    await expect(
      loginUser({ username: "unknown", password: "1234" })
    ).rejects.toThrow("Invalid Credentials");
  });

  test("Throw error when password is incorrect", async () => {
    player.findOne.mockResolvedValue({ id: 1, password: "hashedPassword" });
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      loginUser({ username: "lobo", password: "wrong" })
    ).rejects.toThrow("Invalid Credentials");
  });
});

describe("Logout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("Should revoke token if not revoked", async () => {
    blackListToken.isTokenRevoked.mockResolvedValue(false);

    const result = await logoutUser("tokenInvalid");

    expect(blackListToken.revokeToken).toHaveBeenCalledWith("tokenInvalid");
    expect(result).toEqual({ message: "User logged out successfully" });
  });

  test("Should not revoke token if already revoked", async () => {
    blackListToken.isTokenRevoked.mockResolvedValue(true);
    const result = await logoutUser("tokenInvalid");

    expect(blackListToken.revokeToken).not.toHaveBeenCalled();
    expect(result).toEqual({
      error: "The token is not valid or already revoked",
    });
  });
});

describe("getUserById", () => {
  test("Should return user if exist", async () => {
    const user = { id: 1, username: "lobo" };
    player.findByPk.mockResolvedValue(user);

    const result = await getUserById(1);

    expect(player.findByPk).toHaveBeenCalledWith(1);
    expect(result.isRight()).toBe(true);
    expect(result.right).toEqual(user);
  });

  test("should throw error if user not found", async () => {
    player.findByPk.mockRejectedValue(new Error("DB error"));

    await expect(getUserById(999)).rejects.toThrow(
      "The user with 999 not exists"
    );
  });
});
