import jwt from "jsonwebtoken";

const generateAuthToken = async (id, role, email) => {
  const payload = {
      data: { _id: id, role: role, email: email },
    },
    secretKey = process.env.TOKEN_VERIFY,
    options = { expiresIn: "600m" };
  return jwt.sign(payload, secretKey, options);
};

const generateMerchantAuthToken = async (
  id,
  role,
  email,
  isActive,
  merchantId
) => {
  const payload = {
      data: {
        _id: id,
        role: role,
        email: email,
        isActive: isActive,
        merchantId: merchantId,
      },
    },
    secretKey = process.env.TOKEN_VERIFY,
    options = { expiresIn: "600m" };
  return jwt.sign(payload, secretKey, options);
};

function authenticateAdminToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "token not found", data: null });
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

function authenticateMerchantToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "token not found", data: null });
  }
  const result = verifyAccessToken(token);
  if (result.status === "valid") {
    const userRoles = result.decoded.data.role || [];
    const requiredRole = "merchant";
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

export {
  generateAuthToken,
  generateMerchantAuthToken,
  verifyAccessToken,
  authenticateAdminToken,
  authenticateMerchantToken,
};
