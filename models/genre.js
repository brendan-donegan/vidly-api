const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const GENRE_MIN_LENGTH = 5;
const GENRE_MAX_LENGTH = 50;

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: GENRE_MIN_LENGTH,
    maxlength: GENRE_MAX_LENGTH,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(GENRE_MIN_LENGTH).max(GENRE_MAX_LENGTH).required(),
  };

  return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;
