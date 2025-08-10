import request from "supertest";
import app from "../../app.js";
import sequelize from "../../db/db.js";
import player from "../../models/player.js";

describe("Database integration tests for Player CRUD", () => {
  beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await player.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a new player", async () => {
    const res = await request(app)
      .post("/api/players")
      .send({
        username: "Artorias",
        age: 35,
        email: "artorias@fromsoft.com",
        password: "abysswalker"
      })
      .expect(201);

    expect(res.body).toEqual({ message: "User registered successfully" });
  });

  it("should get all players", async () => {
    await player.create({
      username: "Guts",
      age: 28,
      email: "guts@fromsoft.com",
      password: "dragonslayer"
    });

    const res = await request(app).get("/api/players").expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].username).toBe("Guts");
  });

  it("should get a player by ID", async () => {
    const created = await player.create({
      username: "Lady Maria",
      age: 27,
      email: "ladymaria@fromsoft.com",
      password: "astralclocktower"
    });

    const res = await request(app)
      .get(`/api/players/${created.id}`)
      .expect(200);

    expect(res.body.username).toBe("Lady Maria");
  });

  it("should update a player", async () => {
    const created = await player.create({
      username: "Maliketh",
      age: 40,
      email: "maliketh@fromsoft.com",
      password: "blackblade"
    });

    const res = await request(app)
      .put(`/api/players/${created.id}`)
      .send({
        username: "Maliketh the Black Blade",
        age: 41,
        email: "malikethblackblade@fromsoft.com",
        password: "destineddeath"
      })
      .expect(200);

    expect(res.body.username).toBe("Maliketh the Black Blade");
    expect(res.body.age).toBe(41);
  });

  it("should delete a player", async () => {
    const created = await player.create({
      username: "Gehrman",
      age: 60,
      email: "gehrman@fromsoft.com",
      password: "firsthunter"
    });

    await request(app).delete(`/api/players/${created.id}`).expect(204);

    const found = await player.findByPk(created.id);
    expect(found).toBeNull();
  });
});
