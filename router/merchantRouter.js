import { express } from "../app.js";
import {
  merchantLoginController,
  merchantOtpGenerateAndSendController,
  merchantOtpVerificationController,
  editMerchantController,
  getMerchantController,
  merchantPasswordChangeController,
  merchantPasswordForgetController,
} from "../controller/merchantController.js";
import { authenticateMerchantToken } from "../config/jwtConfig.js";

const merchant_router = express.Router();
const baseUrl = "/merchant";

merchant_router.post(`${baseUrl}/login`, merchantLoginController);
merchant_router.post(
  `${baseUrl}/generateOtp/send`,
  authenticateMerchantToken,
  merchantOtpGenerateAndSendController
);

merchant_router.get(
  `${baseUrl}/verifyOtp`,
  authenticateMerchantToken,
  merchantOtpVerificationController
);

merchant_router.put(
  `${baseUrl}/:merchantId/edit`,
  authenticateMerchantToken,
  editMerchantController
);

merchant_router.get(
  `${baseUrl}/:merchantId`,
  authenticateMerchantToken,
  getMerchantController
);

merchant_router.put(
  `${baseUrl}/password/change`,
  authenticateMerchantToken,
  merchantPasswordChangeController
);
merchant_router.put(
  `${baseUrl}/password/forget`,
  authenticateMerchantToken,
  merchantPasswordForgetController
);

export { merchant_router };
