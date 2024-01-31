import { Admin } from "../entity/adminEntity.js";
import bcrypt from "bcryptjs";
import { generateAuthToken } from "../config/jwtConfig.js";
import { verifyCredentials } from "../utils/commonUtil.js";

// code to register the admin
const registerAdmin = async (req) => {
  const encodedPassword = await bcrypt.hash(req.body.password, 12);
  const admin = new Admin({
    email: req.body.email,
    password: encodedPassword,
    role: "admin",
  });
  await admin.save();
  return {
    message: "admin registred successfully.",
    status: "success",
    data: admin,
  };
};

// code to edit the admin
const editAdmin = async (req) => {
  const adminId = req.params.id;
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return {
      message: "admin not found.",
      status: "error",
      data: null,
    };
  }
  if (req.body.email) {
    admin.email = req.body.email;
  }
  await admin.save();
  return {
    message: "admin updated successfully.",
    status: "success",
    data: null,
  };
};

// code to get the admin details
const getAdmin = async (req) => {
  const adminId = req.params.id;
  const admin = await Admin.findById(adminId);
  if (!admin) {
    return {
      message: "admin not found.",
      status: "error",
      data: null,
    };
  }
  return {
    message: "admin fetched successfully.",
    status: "success",
    data: mapAdmin(admin),
  };
};

function mapAdmin(originalData) {
  const { _id, balance, email, role, createdDate } = originalData;
  return { _id, balance, email, role, createdDate };
}

// code for admin login
const adminLogin = async (req) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return {
      message: "email not registered.",
      status: "error",
      data: null,
    };
  }
  const isValid = await verifyCredentials(password, admin.password);
  if (isValid) {
    const token = await generateAuthToken(admin._id, admin.role, admin.email);
    return {
      message: "admin login successful.",
      status: "success",
      data: token,
    };
  } else {
    return {
      message: "invalid credentials.",
      status: "error",
      data: null,
    };
  }
};

export { registerAdmin, editAdmin, getAdmin, adminLogin };
