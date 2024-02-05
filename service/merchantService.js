import { MerchantEntity } from "../entity/merchantEntity.js";
import { generateMerchantAuthToken } from "../config/jwtConfig.js";
import { verifyCredentials, generateRandomOtp } from "../utils/commonUtil.js";
import { OtpEntity } from "../entity/otpEntity.js";
import { ftruncate } from "fs";

// code to login into merchant account
const merchantLogin = async (req) => {
  const { email, password } = req.body;
  const merchant = MerchantEntity.findOne(email);
  if (!merchant) {
    return {
      message: "email not registered.",
      status: "error",
      data: null,
    };
  }
  const isValid = await verifyCredentials(password, merchant.password);
  if (isValid) {
    const token = await generateMerchantAuthToken(
      merchant._id,
      merchant.role,
      merchant.email,
      merchant.isActive
    );
    return {
      message: "merchant login successful.",
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

// code to generate and send OTP
const generateAndSendOtp = async (req) => {
  const email = req.body.email;
  const merchant = await MerchantEntity.findOne({ email });
  if (!merchant) {
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

// code to verify the otp entered by merchant
const verifyOtpOfMerchant = async (req) => {
  const enteredOtp = req.body.otp;
  if (enteredOtp.length != 6) {
    return {
      message: "otp length must be 6.",
      status: "error",
      data: null,
    };
  }
  const email = req.body.email;
  const merchant = await MerchantEntity.findOne({ email });
  if (!merchant) {
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

// code to edit the merchant
const editMerchant = async (req) => {
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
  const merchant = await MerchantEntity.findOne({ email });
  if (!merchant) {
    return {
      message: "email not registered.",
      status: "error",
      data: null,
    };
  }
  merchant = await updateMerchantObject(merchant, req);
  await merchant.save();
  return {
    message: "merchant updated successfully",
    status: "success",
    data: merchant,
  };
};

async function updateMerchantObject(merchant, req) {
  merchant.email = req.body.email;
  merchant.firstName = req.body.firstName;
  merchant.lastName = req.body.lastName;
  merchant.phoneNumber = req.body.phoneNumber;
  merchant.address = req.body.address;
  merchant.ifscCode = req.body.ifscCode;
  merchant.accountNumber = req.body.accountNumber;
  merchant.gstNumber = req.body.gstNumber;

  return merchant;
}

export { merchantLogin, generateAndSendOtp, verifyOtpOfMerchant };
