import { express } from "../../app.js";
import {
  merchantLoginController,
  merchantOtpGenerateAndSendController,
  merchantOtpVerificationController,
  editMerchantController,
  getMerchantController,
  merchantPasswordChangeController,
  merchantPasswordForgetController,
  loadMoneyRequestController,
  allLoadMoneyRequestFetchController,
  xClientIdAndXSecretIdCreationController,
  xClientIdAndXSecretIdFetchController,
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

merchant_router.patch(
  `${baseUrl}/:merchantId/edit`,
  authenticateMerchantToken,
  editMerchantController
);

merchant_router.get(
  `${baseUrl}/:merchantId`,
  authenticateMerchantToken,
  getMerchantController
);

merchant_router.patch(
  `${baseUrl}/password/change`,
  authenticateMerchantToken,
  merchantPasswordChangeController
);

merchant_router.patch(
  `${baseUrl}/password/forget`,
  authenticateMerchantToken,
  merchantPasswordForgetController
);

merchant_router.post(
  `${baseUrl}/:merchantId/loadmoney/request`,
  authenticateMerchantToken,
  loadMoneyRequestController
);

merchant_router.get(
  `${baseUrl}/:merchantId/loadmoney/request`,
  authenticateMerchantToken,
  allLoadMoneyRequestFetchController
);

merchant_router.post(
  `${baseUrl}/:merchantId/generate/XCredentials`,
  authenticateMerchantToken,
  xClientIdAndXSecretIdCreationController
);

merchant_router.get(
  `${baseUrl}/:merchantId/fetch/XCredentials`,
  authenticateMerchantToken,
  xClientIdAndXSecretIdFetchController
);

export { merchant_router };
