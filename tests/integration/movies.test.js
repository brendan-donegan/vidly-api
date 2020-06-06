const supertest = require("supertest");
const { Movie } = require("../../models/movie");

let server;

describe("/api/movies", () => {
  beforeEach(() => {
    server = require("../../server");
  });

  afterEach(async () => {
    await Movie.deleteMany({});
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
});
