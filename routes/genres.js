const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");

router.get("/", async function handleGetGenres(req, res) {
  try {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.post("/", async function handleCreateGenre(req, res) {
  // Validate the payload
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Create the genre in the database
  const genre = new Genre({
    name: req.body.name,
  });
  try {
    const created = await genre.save();
    res.send(created);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.put("/:id", async function handleUpdateGenre(req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) res.status(404).send();
    genre.name = req.body.name;
    const newGenre = await genre.save();
    res.send(newGenre);
  } catch (ex) {
    res.status(500).send(err.message);
  }
});

router.delete("/:id", async function handleDeleteGenre(req, res) {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) res.status(404).send();
    res.send(genre);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

router.get("/:id", async function handleGetGenre(req, res) {
  try {
    const genre = await Genre.findById(req.params.id).select({ name: 1 });
    if (!genre) res.status(404).send();
    res.send(genre);
  } catch (ex) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
