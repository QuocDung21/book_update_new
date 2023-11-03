const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
  const { accessToken } = req.cookies;
  console.log(accessToken);
  if (!accessToken) {
    return res.status(409).json({ error: "Please login first" });
  } else {
    try {
      const deCodeToken = await jwt.verify(
        accessToken,
        process.env.SECRET || "asdasdqw"
      );
      req.role = deCodeToken.role;
      req.id = deCodeToken.id;
      next();
    } catch (error) {
      return res.status(409).json({ error: "Please login" });
    }
  }
};
