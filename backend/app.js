const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const auth = require("./middlewares/auth");
const NotFoundError = require("./errors/NotFoundError");
const { login, createUser } = require("./controllers/users");
const { redirectLink } = require("./controllers/links");
const cors = require("cors");

const { requestLogger, errorsLogger } = require("./middlewares/loggers");
const {
  signUpValidation,
  signInValidation,
} = require("./middlewares/validation");

const { PORT = 5000 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/linkShortnerdb")
  .then(() => console.log("Успешное подключение к БД"))
  .catch((err) => console.log(`Ошибка подключения к БД: ${err}`));

const app = express();
app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.get("/", (req, res) => {
  res.status(200).send({
    message: "Привет",
  });
});

app.post("/signin", signInValidation, login);
app.get("/:code", redirectLink);

app.post("/signup", signUpValidation, createUser);

app.use("/users", auth, require("./routes/users"));
app.use("/links", auth, require("./routes/links"));

app.use("*", () => {
  throw new NotFoundError("Страница не найдена");
});

app.use(errorsLogger);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "На сервере произошла ошибка" : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен, порт: ${PORT}`);
});
