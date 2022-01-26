// CREATING A HANDLER TO CATCH ERROR
function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      Error: err.name,
      Message: err.inner.message,
    });
  }
  if (err.name === "ValidationError") {
    return res.status(401).json({
      Error: err.name,
      Message: err.inner.message,
    });
  }
}

module.exports = errorHandler;
