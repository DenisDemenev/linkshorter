const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;

const linkSchema = new Schema({
  desc: {
    type: String,
    minlength: 2,
    maxlength: 150,
  },
  code: {
    type: String,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(URL) {
        return validator.isURL(URL);
      },
      message: "Введен некорректный URL",
    },
  },
  linkShort: {
    type: String,
    required: true,
  },
  redirect: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("link", linkSchema);
