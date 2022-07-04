const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validId = require("../middleware/validId");
const { Genre, validate } = require("../models/genre");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  // Validate the payload
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // Create the genre in the database
  const genre = new Genre({
    name: req.body.name,
  });
  const created = await genre.save();
  res.status(201).send(created);
});

router.put("/:id", [auth, admin, validId], async (req, res, next) => {
  const { e } = validate(req.body);
  if (e) {
    return res.status(400).send(e.details[0].message);
  }
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    return res.status(404).send(`The genre with the given ID was not found.`);
  }
  genre.name = req.body.name;
  const newGenre = await genre.save();
  res.send(newGenre);
});

router.delete("/:id", [auth, admin, validId], async (req, res, next) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) {
    return res.status(404).send();
  }
  res.send(genre);
});

router.get("/:id", validId, async (req, res) => {
  const genre = await Genre.findById(req.params.id).select("name");
  if (!genre) {
    return res.status(404).send(`The genre with the given ID was not found.`);
  }
  res.send(genre);
});

module.exports = router;
