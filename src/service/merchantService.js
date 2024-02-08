import { MerchantEntity } from "../entity/merchantEntity.js";
import { generateMerchantAuthToken } from "../config/jwtConfig.js";
import EmailService from "../utils/emailSender.js";
import { verifyCredentials, generateRandomOtp } from "../utils/commonUtil.js";
import { OtpEntity } from "../entity/otpEntity.js";
import { LoadMoneyEntity } from "../entity/loadMoneyEntity.js";
import { AuthRecordEntity } from "../entity/authRecordEntity.js";

// code to login into merchant account
const merchantLogin = async (req) => {
  const { email, password } = req.body;
  const merchant = await MerchantEntity.findOne({ email });
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
      merchant.isActive,
      merchant.merchantId
    );
    const authCredentials = await AuthRecordEntity.findOne({
      $and: [{ merchantId: merchant.merchantId }, { isExpired: false }],
    });
    return {
      message: "merchant login successful.",
      status: "success",
      data: {
        token: token,
        authCredentials: {
          xClientId: authCredentials.xClientId,
          xSecretId: authCredentials.xSecretId,
        },
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
  if (req.phoneNumber) {
    const existingMerchant = await MerchantEntity.findOne({
      phoneNumber: req.phoneNumber,
    });
    if (existingMerchant) {
      return {
        message: "phoneNumber already exists.",
        status: "error",
        data: null,
      };
    }
  }
  if (req.email) {
    const existingMerchant = await MerchantEntity.findOne({
      emaili: req.email,
    });
    if (existingMerchant) {
      return {
        message: "email already exists.",
        status: "error",
        data: null,
      };
    }
  }
  const merchantId = req.params.merchantId;
  let merchant = await MerchantEntity.findOne({ merchantId });
  if (!merchant) {
    return {
      message: "merchant not found.",
      status: "error",
      data: null,
    };
  }
  merchant = await updateMerchantObject(merchant, req);
  merchant.updatedDate = Date.now();
  await merchant.save();
  return {
    message: "merchant updated successfully",
    status: "success",
    data: merchant,
  };
};

async function updateMerchantObject(merchant, req) {
  if (req.body.firstName && req.body.firstName !== merchant.firstName) {
    merchant.firstName = req.body.firstName;
  }
  if (req.body.lastName && req.body.lastName !== merchant.lastName) {
    merchant.lastName = req.body.lastName;
  }
  if (req.body.phoneNumber && req.body.phoneNumber !== merchant.phoneNumber) {
    merchant.phoneNumber = req.body.phoneNumber;
  }
  if (req.body.address && req.body.address !== merchant.address) {
    merchant.address = req.body.address;
  }
  if (req.body.ifscCode && req.body.ifscCode !== merchant.ifscCode) {
    merchant.ifscCode = req.body.ifscCode;
  }
  if (
    req.body.accountNumber &&
    req.body.accountNumber !== merchant.accountNumber
  ) {
    merchant.accountNumber = req.body.accountNumber;
  }
  if (req.body.gstNumber && req.body.gstNumber !== merchant.gstNumber) {
    merchant.gstNumber = req.body.gstNumber;
  }

  return merchant;
}

// code to get the merchant profile
const getMerchantProfile = async (req) => {
  const merchantId = req.params.merchantId;
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
    address,
    accountNumber,
    ifscCode,
    gstNumber,
    createdDate,
  };
}

// code for password change of the merchant
const changePasswordForMerchant = async (req) => {
  const { email, password, newPassword } = req.body;
  const merchant = await MerchantEntity.findOne({ email });
  if (!merchant) {
    return {
      message: "email not registered.",
      status: "error",
      data: null,
    };
  }
  const isValid = await verifyCredentials(password, merchant.password);
  if (isValid) {
    merchant.password = await bcrypt.hash(newPassword, 12);
    merchant.updatedDate = Date.now();
    await merchant.save();
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

// code for password forget of the merchant
const forgetPasswordForMerchant = async (req) => {
  const { email, newPassword } = req.body;
  const merchant = await MerchantEntity.findOne({ email });
  if (!merchant) {
    return {
      message: "email not registered.",
      status: "error",
      data: null,
    };
  }
  merchant.password = await bcrypt.hash(newPassword, 12);
  merchant.updatedDate = Date.now();
  await merchant.save();
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

// code to send load-money request to the admin
const requestLoadMoney = async (req) => {
  const merchantId = req.params.merchantId;
  const merchant = await MerchantEntity.findOne({ merchantId });
  if (!merchant) {
    return {
      message: "merchant not found",
      status: "error",
      data: null,
    };
  }
  const existingLoadMoneyRequest = await LoadMoneyEntity.findOne({
    referenceUtr: req.body.referenceUtr,
  });
  if (existingLoadMoneyRequest) {
    return {
      message: "provide unique reference UTR",
      status: "error",
      data: null,
    };
  }
  const loadMoney = await createLoadMoneyEntity(req);
  loadMoney.save();
  return {
    message: "loadmoney request raised successfully",
    status: "success",
    data: loadMoney,
  };
};

async function createLoadMoneyEntity(req) {
  const loadMoneyEntity = new LoadMoneyEntity({
    merchantId: req.params.merchantId,
    email: req.body.email,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    amount: req.body.amount,
    merchantAccountNumber: req.body.merchantAccountNumber,
    merchantBankName: req.body.merchantBankName,
    merchantIfscCode: req.body.merchantIfscCode,
    adminAccountNumber: req.body.adminAccountNumber,
    adminBankName: req.body.adminBankName,
    referenceUtr: req.body.referenceUtr,
    remarks: req.body.remarks,
    requestDate: Date.now(),
  });
  return loadMoneyEntity;
}

// code to fetch all the loadmoney request raised by merchant
const fetchAllLoadMoneyRequest = async (req) => {
  const merchantId = req.params.merchantId;
  const merchant = await MerchantEntity.findOne({ merchantId });
  if (!merchant) {
    return {
      message: "merchant not found",
      status: "error",
      data: null,
    };
  }
  const loadMoneyRequestList = await LoadMoneyEntity.find({ merchantId }).sort({
    _id: -1,
  });
  return {
    message: "all prefund request fetched",
    status: "success",
    data: loadMoneyRequestList,
  };
};

// code to generate new xClientId and xSecretId of merchant
const generateNewXClientIdAndXSecretId = async (req) => {
  const merchantId = req.params.merchantId;
  const merchant = await MerchantEntity.findOne({ merchantId });
  if (!merchant) {
    return {
      message: "merchant not found",
      status: "error",
      data: null,
    };
  }
  const existingAuthRecord = await AuthRecordEntity.findOne({
    $and: [{ merchantId: merchantId }, { isExpired: false }],
  });
  if (existingAuthRecord) {
    existingAuthRecord.isExpired = true;
    existingAuthRecord.save();
  }
  const newAuthRecord = await new AuthRecordEntity({
    merchantId: merchantId,
  });
  await newAuthRecord.save();
  return {
    status: "success",
    message: "new xClientId and xSecretId generated",
    data: newAuthRecord,
  };
};

// code to fetch all xClientId and xSecretId of the merchant
const fetchAllXClientIdAndXSecretId = async (req) => {
  const merchantId = req.params.merchantId;
  const merchant = await MerchantEntity.findOne({ merchantId });
  if (!merchant) {
    return {
      message: "merchant not found",
      status: "error",
      data: null,
    };
  }
  const xClientIdAndXSecretIdList = await AuthRecordEntity.find({
    merchantId: merchantId,
  }).sort({ _id: -1 });
  return {
    status: "success",
    message: "all xClientId and xSecretId fetched",
    data: xClientIdAndXSecretIdList,
  };
};

//

export {
  merchantLogin,
  generateAndSendOtp,
  verifyOtpOfMerchant,
  editMerchant,
  getMerchantProfile,
  changePasswordForMerchant,
  forgetPasswordForMerchant,
  requestLoadMoney,
  fetchAllLoadMoneyRequest,
  generateNewXClientIdAndXSecretId,
  fetchAllXClientIdAndXSecretId,
};
