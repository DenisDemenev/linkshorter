const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const UnauthorizedError = require("../errors/UnauthorizedError");

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: "Введен некорректный email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError("Неправильные почта или пароль")
        );
      }
      return bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
          return Promise.reject(
            new UnauthorizedError("Неправильные почта или пароль")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
