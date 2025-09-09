import request from "supertest";
import app from "../../app.js";
import sequelize from "../../db/db.js";
import player from "../../models/player.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

describe("Database integration tests for Player CRUD", () => {
  // let token;

  // beforeAll(async () => {
  //   await sequelize.authenticate();
  //   await sequelize.drop();  
  //   await sequelize.sync({ force: true });

  //   const hashedPassword = await bcrypt.hash("sirris", 10);

  //   await player.create({
  //     username: "sirris",
  //     age: 30,
  //     email: "sirris@example.com",
  //     password: hashedPassword,
  //   });

  //   const loginRes = await request(app)
  //     .post("/api/auth/login")
  //     .send({ username: "sirris", password: "sirris" })
  //     .expect(200);

  //   token = loginRes.body?.right?.access_token || null;
  // });

  // beforeEach(async () => {
  //   await player.destroy({ where: { username: { [Op.ne]: "sirris" } } });
  // });

  // afterAll(async () => {
  //   await sequelize.close();
  // });

  // it("should create a new player", async () => {
  //   const res = await request(app)
  //     .post("/api/players")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({
  //       username: "Artorias",
  //       age: 35,
  //       email: "artorias@fromsoft.com",
  //       password: "abysswalker",
  //     })
  //     .expect(201);

  //   expect(res.body).toEqual({ message: "User registered successfully" });
  // });

  // it("should get all players", async () => {
  //   await player.create({
  //     username: "Guts",
  //     age: 28,
  //     email: "guts@fromsoft.com",
  //     password: "dragonslayer",
  //   });

  //   const res = await request(app)
  //     .get("/api/players")
  //     .set("Authorization", `Bearer ${token}`)
  //     .expect(200);

  //   expect(Array.isArray(res.body)).toBe(true);
  //   expect(res.body.length).toBeGreaterThanOrEqual(1);
  //   expect(res.body.some((p) => p.username === "Guts")).toBe(true);
  // });

  // it("should get a player by ID", async () => {
  //   const created = await player.create({
  //     username: "Lady Maria",
  //     age: 27,
  //     email: "ladymaria@fromsoft.com",
  //     password: "astralclocktower",
  //   });

  //   const res = await request(app)
  //     .get(`/api/players/${created.id}`)
  //     .set("Authorization", `Bearer ${token}`)
  //     .expect(200);

  //   expect(res.body.username).toBe("Lady Maria");
  // });

  // it("should update a player", async () => {
  //   const created = await player.create({
  //     username: "Maliketh",
  //     age: 40,
  //     email: "maliketh@fromsoft.com",
  //     password: "blackblade",
  //   });

  //   const res = await request(app)
  //     .put(`/api/players/${created.id}`)
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({
  //       username: "Maliketh the Black Blade",
  //       age: 41,
  //       email: "malikethblackblade@fromsoft.com",
  //       password: "destineddeath",
  //     })
  //     .expect(200);

  //   expect(res.body.username).toBe("Maliketh the Black Blade");
  //   expect(res.body.age).toBe(41);
  // });

  // it("should delete a player", async () => {
  //   const created = await player.create({
  //     username: "Gehrman",
  //     age: 60,
  //     email: "gehrman@fromsoft.com",
  //     password: "firsthunter",
  //   });

  //   await request(app)
  //     .delete(`/api/players/${created.id}`)
  //     .set("Authorization", `Bearer ${token}`)
  //     .expect(204);

  //   const found = await player.findByPk(created.id);
  //   expect(found).toBeNull();
  // });
});
