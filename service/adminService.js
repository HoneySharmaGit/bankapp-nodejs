import { AdminEntity } from "../entity/adminEntity.js";
import { OtpEntity } from "../entity/otpEntity.js";
import EmailService from "../utils/emailSender.js";
import bcrypt from "bcryptjs";
import { generateAuthToken } from "../config/jwtConfig.js";
import { verifyCredentials } from "../utils/commonUtil.js";

// code to register the admin
const registerAdmin = async (req) => {
  const encodedPassword = await bcrypt.hash(req.body.password, 12);
  const admin = new AdminEntity({
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
  const admin = await AdminEntity.findById(adminId);
  if (!admin) {
    return {
      message: "admin not found.",
      status: "error",
      data: null,
    };
  }
  admin = getUpdatedAdmin(req, admin);
  await admin.save();
  return {
    message: "admin updated successfully.",
    status: "success",
    data: null,
  };
};

function getUpdatedAdmin(req, admin) {
  if (req.body.email) {
    admin.email = req.body.email;
  }
  if (req.body.firstName) {
    admin.email = req.body.email;
  }
  if (req.body.lastName) {
    admin.email = req.body.email;
  }
  admin.updatedDate = Date.now();
  return admin;
}

// code to get the admin details
const getAdmin = async (req) => {
  const adminId = req.params.id;
  const admin = await AdminEntity.findById(adminId);
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
  const admin = await AdminEntity.findOne({ email });
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

// code to generate and send OTP for the
const generateAndSendOtp = async (req) => {
  const email = req.body.email;
  const admin = await AdminEntity.findOne({ email });
  if (!admin) {
    return {
      message: "email not registered.",
      status: "error",
      data: null,
    };
  }
  const randomOtp = generateRandomOtp();
  const existingOtpEntity = await OtpEntity.findOne({ email });
  if (existingOtpEntity != null) {
    existingOtpEntity.savedOtp = randomOtp;
    await existingOtpEntity.save();
  } else {
    const otp = new OtpEntity({
      email: email,
      savedOtp: randomOtp,
    });
    await otp.save();
  }
  EmailService.sendEmail(
    email,
    "email for OTP verification",
    `Hello sir, here's the email for OTP: ${randomOtp}`
  );
  return {
    message: "otp sent on email.",
    status: "success",
    data: null,
  };
};

function generateRandomOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString().slice(0, 6);
}

// code to verify the otp entered by admin
const verifyOtpByAdmin = async (req) => {
  const enteredOtp = req.body.otp;
  if (enteredOtp.length != 6) {
    return {
      message: "otp length must be 6.",
      status: "error",
      data: null,
    };
  }
  const email = req.body.email;
  const admin = await AdminEntity.findOne({ email });
  if (!admin) {
    return {
      message: "email not registered.",
      status: "error",
      data: null,
    };
  }
  const otp = await OtpEntity.find({ email, enteredOtp });
  if (otp != null) {
    return {
      message: "valid otp.",
      status: "success",
      data: null,
    };
  }
  return {
    message: "invalid otp.",
    status: "error",
    data: null,
  };
};

// code to change the password for admin
const changePasswordForAdmin = async (req) => {
  const { email, password, newPassword } = req.body;
  const admin = await AdminEntity.findOne({ email });
  if (!admin) {
    return {
      message: "email not registered.",
      status: "error",
      data: null,
    };
  }
  const isValid = await verifyCredentials(password, admin.password);
  if (isValid) {
    admin.password = await bcrypt.hash(newPassword, 12);
    admin.updatedDate = Date.now();
    await admin.save();
    EmailService.sendEmail(
      email,
      "password changed successfully",
      "Hello sir, your password has been changed successfully. you will be able to login to your account using your new password now!"
    );
    return {
      message: "password changed successfully",
      status: "success",
      data: null,
    };
  } else {
    return {
      message: "invalid credentails",
      status: "error",
      data: null,
    };
  }
};

// code for forget password for admin
const forgetPasswordForAdmin = async (req) => {
  const { email, newPassword } = req.body;
  const admin = await AdminEntity.findOne({ email });
  if (!admin) {
    return {
      message: "email not registered.",
      status: "error",
      data: null,
    };
  }
  admin.password = await bcrypt.hash(newPassword, 12);
  admin.updatedDate = Date.now();
  await admin.save();
  EmailService.sendEmail(
    email,
    "password changed successfully",
    "Hello sir, your password has been changed successfully. you will be able to login to your account using your new password now!"
  );
  return {
    message: "password changed successfully",
    status: "success",
    data: null,
  };
};

export {
  registerAdmin,
  editAdmin,
  getAdmin,
  adminLogin,
  generateAndSendOtp,
  verifyOtpByAdmin,
  changePasswordForAdmin,
  forgetPasswordForAdmin,
};
