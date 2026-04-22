const { errorResponder, errorTypes } = require("./errors");

module.exports = (request, response, next) => {
  if (request.user && request.user.role === "admin") {
    return next();
  }

  return next(
    errorResponder(
      errorTypes.FORBIDDEN,
      "Akses ditolak! Halaman ini hanya untuk Admin.",
    ),
  );
};
