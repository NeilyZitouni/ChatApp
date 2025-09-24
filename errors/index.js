const CustomAPIError = require('./customAPIError');
const BadRequestError = require('./bad-request');
const ForbiddenError = require('./forbidden-error');
const NotFoundError = require('./not-found-error');
const UnauthorizedError = require('./unauthorized-error');

module.exports = {
  CustomAPIError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
};
