import { express } from "../app.js";
import { merchantLoginController } from "../controller/merchantController.js";

const merchant_router = express.Router();
const baseUrl = "/merchant";

merchant_router.post(`${baseUrl}/login`, merchantLoginController);

export { merchant_router };
