const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validId = require("../middleware/validId");
const { Genre, validate } = require("../models/genre");

router.get("/", async function handleGetGenres(req, res, next) {
  try {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  } catch (ex) {
    next(ex);
  }
});

router.post("/", auth, async function handleCreateGenre(req, res, next) {
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
    next(ex);
  }
});

router.put("/:id", [auth, admin, validId], async function handleUpdateGenre(
  req,
  res,
  next
) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) res.status(404).send();
    genre.name = req.body.name;
    const newGenre = await genre.save();
    res.send(newGenre);
  } catch (ex) {
    next(ex);
  }
});

router.delete("/:id", [auth, admin, validId], async function handleDeleteGenre(
  req,
  res,
  next
) {
  try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) res.status(404).send();
    res.send(genre);
  } catch (ex) {
    next(ex);
  }
});

router.get("/:id", validId, async function handleGetGenre(req, res, next) {
  try {
    const genre = await Genre.findById(req.params.id).select("name");
    if (!genre)
      return res.status(404).send(`The genre with the given ID was not found.`);
    res.send(genre);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
