const path = require('path');
const { createLogger, transports, format } = require('winston');
const { logger, errorLogger } = require('express-winston');

const getLogger = (filename) => (
  createLogger({
    transports: [
      new transports.File({
        filename: path.join(__dirname, `../logs/${filename}`),
      }),
    ],
    format: format.json(),
  }));

const requestLogger = logger({
  winstonInstance: getLogger('request.log'),
});
const errorsLogger = errorLogger({
  winstonInstance: getLogger('error.log'),
});

module.exports = {
  requestLogger,
  errorsLogger,
};
