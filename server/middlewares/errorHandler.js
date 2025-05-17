const { constants } = require("../utils/constants");
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Error",
        message: err.message,
        errors: err.stack,
      });

      break;
    case constants.UNAUTHORIZED_ERROR:
      res.json({
        title: "Unauthorized Access",
        message: err.message,
        errors: err.stack,
      });
      break;
    case constants.FORBIDDEN_ERROR:
      res.json({
        title: "Forbidden Error",
        message: err.message,
        errors: err.stack,
      });

      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not found Error",
        message: err.message,
        errors: err.stack,
      });

      break;
    case constants.INTERNAL_SERVER_ERROR:
      res.json({
        title: "Server error",
        message: err.message,
        errors: err.stack,
      });

      break;
    default:
      res.json({
        message: err.message,
        errors: err.stack,
      });
      break;
  }
};

module.exports = errorHandler;
