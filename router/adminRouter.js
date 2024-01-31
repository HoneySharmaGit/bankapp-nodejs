import { express } from "../app.js";
import {
  registerAdminController,
  editAdminController,
  getAdminController,
  adminLoginController,
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

export { admin_router };
