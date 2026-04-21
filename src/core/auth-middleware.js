const jwt = require("jsonwebtoken");
const { errorResponder, errorTypes } = require("./errors");

const SECRET = "KELOMPOK_8";

module.exports = (request, response, next) => {
  const token = request.headers["authorization"];

  if (!token) {
    return next(errorResponder(errorTypes.UNAUTHORIZED, "Token missing"));
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    request.user = decoded;

    return next();
  } catch (error) {
    return next(
      errorResponder(errorTypes.FORBIDDEN, "Token invalid or expired"),
    );
  }
};
