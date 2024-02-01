import { express } from "../app.js";
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
} from "../controller/adminController.js";
import { authenticateAdminToken } from "../config/jwtConfig.js";

const admin_router = express.Router();
const baseUrl = "/admin";

admin_router.post(`${baseUrl}/register`, registerAdminController);

admin_router.post(`${baseUrl}/login`, adminLoginController);

admin_router.put(
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

admin_router.put(
  `${baseUrl}/password/change`,
  authenticateAdminToken,
  adminPasswordChangeController
);

admin_router.put(
  `${baseUrl}/password/forget`,
  authenticateAdminToken,
  adminPasswordForgetController
);

admin_router.post(
  `${baseUrl}/onboard/merchant`,
  authenticateAdminToken,
  onboardMerchantController
);

admin_router.put(
  `${baseUrl}/merchant/:merchantId/active&inactive`,
  authenticateAdminToken,
  activeOrInActiveMerchantController
);

export { admin_router };
