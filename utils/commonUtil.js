import bcrypt from "bcryptjs";
import { MerchantEntity } from "../entity/merchantEntity.js";

const verifyCredentials = async (password, savedEncryptedPassword) => {
  const ismatch = await bcrypt.compare(password, savedEncryptedPassword);
  return ismatch;
};

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

async function generateMerchantId() {
  const lastMerchantId = await MerchantEntity.findOne()
    .sort({ _id: -1 })
    .limit(1)
    .select("merchantId");

  if (!lastMerchantId) {
    return "BPCb48YtK001";
  } else {
    const sixLengthString = generateRandomString(6);
    return `BPC${sixLengthString}00${lastMerchantId.merchantId.substring(11)}`;
  }
}

function generateRandomOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString().slice(0, 6);
}

export {
  verifyCredentials,
  generateRandomString,
  generateMerchantId,
  generateRandomOtp,
};
