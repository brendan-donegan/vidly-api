const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.send(movies);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Get the Genre with the genreId so we can embed it in the movie
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) {
    return res
      .status(404)
      .send(`Could not find genre with id ${req.body.genreId}`);
  }
  const movie = new Movie({
    title: req.body.title,
    genre: genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  try {
    const created = await movie.save();
    res.send(created);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res
        .status(404)
        .send(`Could not find movie with id ${req.params.id}`);
    }
    movie.title = req.body.title;
    movie.numberInStock = req.body.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate;
    // Only go and get the details of the new genre if the ID changed
    if (`${movie.genre._id}` !== req.body.genreId) {
      const newGenre = await Genre.findById(req.body.genreId);
      if (!newGenre) {
        return res
          .status(404)
          .send(`Could not find genre with id ${req.body.genreId}`);
      }
      movie.genre = newGenre;
    }
    const newMovie = await movie.save();
    res.send(newMovie);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) {
      return res
        .status(404)
        .send(`Could not find movie with id ${req.params.id}`);
    }
    res.send(movie);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res
        .status(404)
        .send(`Could not find movie with id ${req.params.id}`);
    }
    res.send(movie);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

module.exports = router;
