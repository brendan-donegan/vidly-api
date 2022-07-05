const supertest = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let server;

const genrePath = "/api/genres";

describe(genrePath, () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(async () => {
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await supertest(server).get(genrePath);
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
      const res = await supertest(server).get(`${genrePath}/${genre._id}`);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "genre1" });
    });

    it("should return 404 if an invalid id is provided", async () => {
      const res = await supertest(server).get(`${genrePath}/foo`);
      expect(res.status).toBe(404);
      expect(res.text).toBe("Invalid ID.");
    });

    it("should return 404 if a valid but non-existent id is provided", async () => {
      const res = await supertest(server).get(
        `${genrePath}/5ed2d0366f87ac0017f72629`
      );
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    async function createGenre(
      genreName,
      token = new User().generateAuthToken()
    ) {
      return supertest(server)
        .post(genrePath)
        .set("x-auth-token", token)
        .send({ name: genreName });
    }

    it("should return 401 if x-auth-token header is not provided", async () => {
      const res = await createGenre("genre1", "");
      expect(res.status).toBe(401);
    });
    it("should return 400 if genre is less than 5 characters", async () => {
      const res = await createGenre("g1");
      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      const res = await createGenre("genre3");
      expect(res.status).toBe(201);
      const genre = await Genre.find({ name: "genre3" });
      expect(genre).not.toBeNull();
    });
  });

  describe("PUT /:id", () => {
    async function updateGenre(
      genreId,
      newGenreName,
      token = new User({ isAdmin: true }).generateAuthToken()
    ) {
      return supertest(server)
        .put(`${genrePath}/${genreId}`)
        .set("x-auth-token", token)
        .send({ name: newGenreName });
    }

    it("should return 401 if no x-auth-token is provided", async () => {
      const res = await updateGenre("foobar", "genre2", "");
      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin user", async () => {
      const token = new User({ isAdmin: false }).generateAuthToken();
      const res = await updateGenre("foobar", "genre2", token);
      expect(res.status).toBe(403);
    });

    it("should return 404 if an invalid id is provided", async () => {
      const res = await updateGenre("foobar", "genre2");
      expect(res.status).toBe(404);
      expect(res.text).toBe("Invalid ID.");
    });

    it("should return 404 if a valid but non-existent id is provided", async () => {
      const res = await updateGenre("deadbeef", "genre3");
      expect(res.status).toBe(404);
      expect(res.text).toBe("The genre with the given ID was not found.");
    });

    it("should return 400 if an invalid name is provided", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await updateGenre(genre._id, "g2");
      expect(res.status).toBe(400);
    });

    it("should update the genre if a valid name is provided", async () => {
      const genre = new Genre({ name: "genre2" });
      await genre.save();
      const res = await updateGenre(genre.id, "genre3");
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "genre3" });
      const updatedGenre = await Genre.findById(genre._id);
      expect(updatedGenre.name).toBe("genre3");
    });
  });

  describe("DELETE /:id", () => {
    it("should return 404 if a valid but non-existent id is provided", async () => {
      const token = new User({ isAdmin: true }).generateAuthToken();
      const res = await supertest(server)
        .delete(`${genrePath}/5ed2d0366f87ac0017f72629`)
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("should delete the genre if it exists", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const token = new User({ isAdmin: true }).generateAuthToken();

      const res = await supertest(server)
        .delete(`${genrePath}/${genre._id}`)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      const deletedGenre = await Genre.findById(genre._id);
      expect(deletedGenre).toBeNull();
    });
  });
});
