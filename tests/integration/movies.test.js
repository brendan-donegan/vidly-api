const supertest = require("supertest");
const { Genre } = require("../../models/genre");
const { Movie } = require("../../models/movie");
const { User } = require("../../models/user");

let server;

describe("/api/movies", () => {
  beforeEach(() => {
    server = require("../../server");
  });

  afterEach(async () => {
    await Movie.deleteMany({});
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all movies", async () => {
      await Movie.collection.insertMany([
        {
          title: "A New Hope",
          genre: "",
          numberInStock: 1,
          dailyRentalRate: 5,
        },
        {
          title: "Empire Strikes Back",
          genre: "",
          numberInStock: 2,
          dailyRentalRate: 3,
        },
      ]);
      const res = await supertest(server).get("/api/movies");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        expect.objectContaining({
          title: "A New Hope",
          numberInStock: 1,
          dailyRentalRate: 5,
        }),
        expect.objectContaining({
          title: "Empire Strikes Back",
          numberInStock: 2,
          dailyRentalRate: 3,
        }),
      ]);
    });
  });

  describe("GET /:id", () => {
    it("should return a movie if a valid id is provided", async () => {
      const movie = new Movie({
        title: "Empire Strikes Back",
        genre: {
          name: "Space Opera",
        },
        numberInStock: 2,
        dailyRentalRate: 3,
      });
      await movie.save();
      const res = await supertest(server).get(`/api/movies/${movie._id}`);
      expect(res.status).toBe(200);
      console.log(res.body);
      expect(res.body).toMatchObject({
        title: "Empire Strikes Back",
        genre: {
          name: "Space Opera",
        },
        numberInStock: 2,
        dailyRentalRate: 3,
      });
    });

    it("should return 404 if an invalid id is provided", async () => {
      const res = await supertest(server).get(`/api/movies/flap`);
      expect(res.status).toBe(404);
      expect(res.text).toBe("Invalid ID.");
    });

    it("should return 404 if a valid but non-existent id is provided", async () => {
      const res = await supertest(server).get(
        `/api/movies/5eae94be025d711a205b3671`
      );
      expect(res.status).toBe(404);
      expect(res.text).toContain("5eae94be025d711a205b3671");
    });
  });

  describe("POST /", () => {
    async function createMovie(
      payload,
      token = new User({ isAdmin: true }).generateAuthToken()
    ) {
      return supertest(server)
        .post(`/api/movies`)
        .set("x-auth-token", token)
        .send(payload);
    }

    it("should create a movie if a valid payload is provided and the x-auth-token is provided", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await createMovie({
        title: "Return of the Jedi",
        genreId: genre._id,
        numberInStock: 1,
        dailyRentalRate: 5,
      });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ title: "Return of the Jedi" });
    });

    it("should return 404 if an invalid or non-existent genreId is provided", async () => {
      const res = await createMovie({
        title: "The Force Awakens",
        genreId: "5ed2d0366f87ac0017f72629",
        numberInStock: 2,
        dailyRentalRate: 3,
      });
      expect(res.status).toBe(404);
      expect(res.text).toContain("Could not find genre with id");
    });

    it("should return 400 if an payload is provided without a title", async () => {
      const res = await createMovie({
        genreId: "5ed2d0366f87ac0017f72629",
        numberInStock: 2,
        dailyRentalRate: 3,
      });
      expect(res.status).toBe(400);
    });
  });

  describe("PUT /:id", () => {
    async function updateMovie(
      movieId,
      payload,
      token = new User({ isAdmin: true }).generateAuthToken()
    ) {
      return supertest(server)
        .put(`/api/movies/${movieId}`)
        .set("x-auth-token", token)
        .send(payload);
    }

    it("should update the movie if the payload is valid and the movie exists", async () => {
      const movie = new Movie({
        title: "Rogue One",
        genre: {
          _id: "5ed2d0366f87ac0017f72629",
          name: "Action",
        },
        numberInStock: 4,
        dailyRentalRate: 3,
      });
      await movie.save();
      const res = await updateMovie(movie._id, {
        title: "Rogue One: A Star Wars Story",
        numberInStock: 4,
        genreId: "5ed2d0366f87ac0017f72629",
        dailyRentalRate: 3,
      });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ title: "Rogue One: A Star Wars Story" });
    });

    it("should update the movie genre if a different genreId is provided", async () => {
      const genre = new Genre({ name: "Terrible" });
      await genre.save();
      const movie = new Movie({
        title: "Solo: A Star Wars Story",
        genre: {
          _id: "5ed2d0366f87ac0017f72629",
          name: "Action",
        },
        numberInStock: 12,
        dailyRentalRate: 1,
      });
      await movie.save();
      const res = await updateMovie(movie._id, {
        title: "Solo: A Star Wars Story",
        genreId: genre._id,
        numberInStock: 12,
        dailyRentalRate: 1,
      });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        title: "Solo: A Star Wars Story",
        genre: {
          name: "Terrible",
        },
        numberInStock: 12,
        dailyRentalRate: 1,
      });
    });
  });
});
