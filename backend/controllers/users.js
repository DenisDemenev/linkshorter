const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");

const CREATED = 201;

module.exports.createUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw new ConflictError("Такой email уже зарегистрирован");
    }
    const hash = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      email,
      password: hash,
    });
    res.status(CREATED).send({
      email: createdUser.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError("Такой email уже зарегистрирован"));
    } else if (err.name === "ValidationError") {
      next(
        new BadRequestError(
          "Переданы некорректные данные при создании пользователя"
        )
      );
    } else {
      next(err);
    }
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError("Пользователь по указанному _id не найден");
    }
    res.send({ user });
  } catch (err) {
    if (err.name === "CastError") {
      next(
        new BadRequestError(
          "Переданы некорректные данные при получении пользователя"
        )
      );
    } else {
      next(err);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, "super-secret-key", {
      expiresIn: "7d",
    });
    res.send({ token });
  } catch (err) {
    next(err);
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError("Пользователь по указанному _id не найден");
    }
    res.send({ user });
  } catch (err) {
    next(err);
  }
};
