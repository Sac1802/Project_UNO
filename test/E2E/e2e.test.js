import fetch from "node-fetch";

const urlBase = "http://localhost:3000/api";

describe("Test End-To-End", () => {
  let token;
  let gameId;

  const generateRandomString = () =>
    Date.now() + Math.floor(Math.random() * 1000);
  const user1Email = `user1-${generateRandomString()}@test.com`;
  const user1Name = `user1-${generateRandomString()}`;
  const user2Email = `user2-${generateRandomString()}@test.com`;
  const user2Name = `user2-${generateRandomString()}`;

  test("Register a new User", async () => {
    const response = await fetch(`${urlBase}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user1Name,
        age: 45,
        email: user1Email,
        password: "ertry",
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toBe("User registered successfully");
  });

  test("Login user", async () => {
    const response = await fetch(`${urlBase}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user1Name, password: "ertry" }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.right).toHaveProperty("access_token");
    token = data.right.access_token;
  });

  test("Create a new Game", async () => {
    const response = await fetch(`${urlBase}/games`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Game Test ${generateRandomString()}`,
        status: "active",
        max_players: 4,
        rules: "Standard rules",
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.message).toBe("Game created successfully");
    gameId = data.game_id;
  });

  test("Register a new user in new game", async () => {
    const responseUser = await fetch(`${urlBase}/players`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user2Name,
        age: 45,
        email: user2Email,
        password: "malenia",
      }),
    });
    const responseLogin = await fetch(`${urlBase}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user2Name, password: "malenia" }),
    });

    const loginData = await responseLogin.json();
    const newToken = loginData.right.access_token;


    const response = await fetch(`${urlBase}/match`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${newToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idGame: gameId,
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty("right");
    expect(data.right).toHaveProperty(
      "message",
      "User joined the game successfully"
    );
  });

  test("Change status game to in_progress", async () => {
    const response = await fetch(`${urlBase}/games/start/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idGame: gameId }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.right).toBe("Game started successfully");
  });

  test("Finish the game", async () => {
    const response = await fetch(`${urlBase}/games/end/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idGame: gameId }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.right).toBe("Game ended successfully");
  });
});
