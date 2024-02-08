import { express } from "../../app.js";
import {
  registerAdminController,
  editAdminController,
  getAdminController,
  adminLoginController,
  adminOtpGenerateAndSendController,
  adminOtpVerificationController,
  adminPasswordChangeController,
  adminPasswordForgetController,
  onboardMerchantController,
  activeOrInActiveMerchantController,
  getMerchantController,
  changeLoadMoneyRequestStatusController,
} from "../controller/adminController.js";
import { authenticateAdminToken } from "../config/jwtConfig.js";

const admin_router = express.Router();
const baseUrl = "/admin";

admin_router.post(`${baseUrl}/register`, registerAdminController);

admin_router.post(`${baseUrl}/login`, adminLoginController);

admin_router.patch(
  `${baseUrl}/:id/edit`,
  authenticateAdminToken,
  editAdminController
);

admin_router.get(
  `${baseUrl}/:id/get`,
  authenticateAdminToken,
  getAdminController
);

admin_router.post(
  `${baseUrl}/generateOtp/send`,
  authenticateAdminToken,
  adminOtpGenerateAndSendController
);

admin_router.get(
  `${baseUrl}/verifyOtp`,
  authenticateAdminToken,
  adminOtpVerificationController
);

admin_router.patch(
  `${baseUrl}/password/change`,
  authenticateAdminToken,
  adminPasswordChangeController
);

admin_router.patch(
  `${baseUrl}/password/forget`,
  authenticateAdminToken,
  adminPasswordForgetController
);

admin_router.post(
  `${baseUrl}/onboard/merchant`,
  authenticateAdminToken,
  onboardMerchantController
);

admin_router.patch(
  `${baseUrl}/merchant/:merchantId/active&inactive`,
  authenticateAdminToken,
  activeOrInActiveMerchantController
);

admin_router.get(
  `${baseUrl}/merchant/:merchantId`,
  authenticateAdminToken,
  getMerchantController
);

admin_router.patch(
  `${baseUrl}/loadMoney/status/change`,
  authenticateAdminToken,
  changeLoadMoneyRequestStatusController
);

export { admin_router };
