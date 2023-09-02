const links = require("../models/link");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const shortid = require("shortid");

const CREATED = 201;

module.exports.createLink = async (req, res, next) => {
  const { desc, link } = req.body;
  try {
    const url = await links.findOne({ link });
    if (url) {
      throw new ConflictError("Такая ссылка уже создана");
    }
    const code = shortid.generate();
    const shortURL = `https://url5.ru/${code}`;
    const newLink = await links.create({
      desc,
      link,
      code,
      owner: req.user._id,
      linkShort: shortURL,
    });
    res.status(CREATED).send({ newLink });
  } catch (err) {
    if (err.name === "ValidationError") {
      next(
        new BadRequestError("Переданы некорректные данные при создании ссылки")
      );
    } else {
      next(err);
    }
  }
};

module.exports.redirectLink = async (req, res, next) => {
  try {
    const { code } = req.params;
    const redLink = await links.findOne({ code });
    if (!redLink) {
      return next(new NotFoundError("Такая ссылка не найдена."));
    }
    await redLink.update({ redirect: redLink.redirect + 1 });
    res.cookie("test", "abcde");
    res.redirect(redLink.link);
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Передана несуществующая ссылка."));
    } else {
      next(err);
    }
  }
};

module.exports.getLinks = async (req, res, next) => {
  try {
    const allLinks = await links
      .find({ owner: req.user._id })
      .sort({ createdAt: -1 });
    res.send(allLinks);
  } catch (err) {
    next(err);
  }
};
