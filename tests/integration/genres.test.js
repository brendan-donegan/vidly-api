const supertest = require("supertest");
const { Genre } = require("../../models/genre");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.deleteMany({});
  });
  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await supertest(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        expect.objectContaining({ name: "genre1" }),
        expect.objectContaining({ name: "genre2" }),
      ]);
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if a valid id is provided", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await supertest(server).get(`/api/genres/${genre._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "genre1" });
    });

    it("should return 404 if an invalid id is provided", async () => {
      const res = await supertest(server).get(`/api/genres/foo`);
      expect(res.status).toBe(404);
      expect(res.text).toBe("Invalid ID.");
    });

    it("should return 404 if a valid but non-existent id is provided", async () => {
      const res = await supertest(server).get(
        "/api/genres/5ed2d0366f87ac0017f72629"
      );
      expect(res.status).toBe(404);
    });
  });
});
