class BussErr extends Error {
  constructor(message, code = 400) {
    super(message);
    this.name = 'BussErr';
    this.code = code;
  }
}

const asyncHandler = (fn) => (req, res, next) => Promise
  .resolve(fn(req, res, next))
  .catch(next);

module.exports = {
  BussErr,
  asyncHandler,
};
