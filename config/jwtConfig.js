import jwt from "jsonwebtoken";

const generateAuthToken = async (id, role, email) => {
  const payload = {
      data: { _id: id, role: role, email: email },
    },
    secretKey = process.env.TOKEN_VERIFY,
    options = { expiresIn: "10m" };
  return jwt.sign(payload, secretKey, options);
};

function authenticateAdminToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }
  const result = verifyAccessToken(token);
  if (result.status === "valid") {
    const userRoles = result.decoded.data.role || [];
    const requiredRole = "admin";
    if (!userRoles.includes(requiredRole)) {
      return res
        .status(401)
        .json({ status: "error", message: "unauthorized access", data: null });
    }
    req.user = result.data;
    next();
  } else {
    return res
      .status(403)
      .json({ status: "error", message: result.message, data: null });
  }
}

function verifyAccessToken(token) {
  const secretKey = process.env.TOKEN_VERIFY;
  try {
    const decoded = jwt.verify(token, secretKey);
    return { status: "valid", decoded: decoded };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { status: "expired", message: "token has expired" };
    } else if (error.name === "JsonWebTokenError") {
      return { status: "invalid", message: "invalid token" };
    } else {
      return { status: "error", message: "error verifying token" };
    }
  }
}

export { generateAuthToken, verifyAccessToken, authenticateAdminToken };
