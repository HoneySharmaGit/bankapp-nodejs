import { AdminEntity } from "../entity/adminEntity.js";
import { MerchantEntity } from "../entity/merchantEntity.js";
import { OtpEntity } from "../entity/otpEntity.js";
import EmailService from "../utils/emailSender.js";
import bcrypt from "bcryptjs";
import { generateAuthToken } from "../config/jwtConfig.js";
import {
  verifyCredentials,
  generateMerchantId,
  generateRandomOtp,
} from "../utils/commonUtil.js";
import { AuthRecordEntity } from "../entity/authRecordEntity.js";
import { LoadMoneyEntity } from "../entity/loadMoneyEntity.js";

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
  let admin = await AdminEntity.findById(adminId);
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
      data: {
        token: token,
      },
    };
  } else {
    return {
      message: "invalid credentials.",
      status: "error",
      data: null,
    };
  }
};

// code to generate and send OTP
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

// code to verify the otp entered by admin
const verifyOtpOfAdmin = async (req) => {
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

// code to onboard the merchant by admin
const onboardMerchant = async (req) => {
  const existingMerchant = await MerchantEntity.findOne({
    $or: [{ email: req.email }, { phoneNumber: req.phoneNumber }],
  });
  if (existingMerchant) {
    return {
      message: "email or phoneNumber already exists.",
      status: "error",
      data: null,
    };
  }
  const merchantObject = await createMerchantObject(req);
  const merchant = new MerchantEntity(merchantObject);
  await merchant.save();
  const newAuthRecord = await new AuthRecordEntity({
    merchantId: merchant.merchantId,
  });
  await newAuthRecord.save();
  return {
    message: "merchant onboarded successfully",
    status: "success",
    data: merchant,
  };
};

async function createMerchantObject(req) {
  const {
    firstName,
    lastName,
    email,
    balance,
    address,
    phoneNumber,
    ifscCode,
    accountNumber,
    gstNumber,
  } = req.body;
  const merchnatId = await generateMerchantId();
  const password = await bcrypt.hash(req.body.password, 12);
  return {
    firstName,
    lastName,
    email,
    password,
    balance,
    address,
    phoneNumber,
    ifscCode,
    accountNumber,
    gstNumber,
    merchantId: merchnatId,
  };
}

// code to active/inactive the merchant
const activeOrInActiveMerchant = async (req) => {
  const merchantId = req.params.merchantId;
  const merchant = await MerchantEntity.findOne({ merchantId });
  if (!merchant) {
    return {
      message: "merchant not found",
      status: "error",
      data: null,
    };
  }
  merchant.isActive = !merchant.isActive;
  merchant.updatedDate = Date.now();
  merchant.save();
  return {
    message: "merchant active status updated",
    status: "success",
    data: null,
  };
};

const getMerchantInfo = async (req) => {
  const merchantId = req.body.merchantId;
  const merchant = await MerchantEntity.findOne({ merchantId });
  if (!merchant) {
    return {
      message: "merchant not found",
      status: "error",
      data: null,
    };
  }
  return {
    message: "merchant fetched successfully.",
    status: "success",
    data: await merchantMap(merchant),
  };
};

async function merchantMap(merchant) {
  const {
    _id,
    merchantId,
    firstName,
    lastName,
    email,
    phoneNumber,
    balance,
    role,
    isActive,
    address,
    accountNumber,
    ifscCode,
    gstNumber,
    createdDate,
  } = merchant;
  return {
    _id,
    merchantId,
    firstName,
    lastName,
    email,
    phoneNumber,
    balance,
    role,
    isActive,
    address,
    accountNumber,
    ifscCode,
    gstNumber,
    createdDate,
  };
}

// code to accept or reject the loadmoney request sent by merchant
const changeStatusOfLoadMoneyRequest = async (req) => {
  const { referenceUtr, merchantId, status } = req.body;
  const merchant = await MerchantEntity.findOne({ merchantId });
  if (!merchant) {
    return {
      message: "merchant not found",
      status: "error",
      data: null,
    };
  }
  const existingLoadMoneyRequest = await LoadMoneyEntity.findOne({
    $and: [
      { merchantId: merchantId },
      { referenceUtr: referenceUtr },
      { actionTakenDate: null },
    ],
  });
  if (!existingLoadMoneyRequest) {
    return {
      status: "error",
      message: "loadmoney request not found",
      data: null,
    };
  }
  existingLoadMoneyRequest.actionTakenDate = Date.now();
  existingLoadMoneyRequest.status = status;
  existingLoadMoneyRequest.save();
  // code to update the merchant balance
  if (status === "accepted") {
    merchant.balance = merchant.balance + existingLoadMoneyRequest.amount;
    merchant.save();
    // amount should be deducted from master-admin balance
    const masterAdmin = await AdminEntity.findOne({
      role: "admin",
      /*{ role: "master-admin" }*/
    });
    masterAdmin.balance = masterAdmin.balance - existingLoadMoneyRequest.amount;
    masterAdmin.save();
  }
  return {
    status: "success",
    message: `admin ${status} loadmoney request`,
    data: existingLoadMoneyRequest,
  };
};

// code to fetch all loadMoney requests of merchants
const fetchAllLoadMoneyRequest = async (req) => {
  const allLoadMoneyList = await LoadMoneyEntity.find().sort({ _id: -1 });
  return {
    status: "success",
    message: "all loadmoney request fetched",
    data: allLoadMoneyList,
  };
};

export {
  registerAdmin,
  editAdmin,
  getAdmin,
  adminLogin,
  generateAndSendOtp,
  verifyOtpOfAdmin,
  changePasswordForAdmin,
  forgetPasswordForAdmin,
  onboardMerchant,
  activeOrInActiveMerchant,
  getMerchantInfo,
  changeStatusOfLoadMoneyRequest,
  fetchAllLoadMoneyRequest,
};
