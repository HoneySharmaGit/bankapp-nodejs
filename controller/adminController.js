import {
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
} from "../service/adminService.js";

const registerAdminController = async (req, resp) => {
  try {
    const response = await registerAdmin(req);
    return resp.status(201).send(response);
  } catch (error) {
    console.error("Error creating admin:", error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const editAdminController = async (req, resp) => {
  try {
    const response = await editAdmin(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error editing admin: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const getAdminController = async (req, resp) => {
  try {
    const response = await getAdmin(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error fetching admin: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const adminLoginController = async (req, resp) => {
  try {
    const response = await adminLogin(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error login admin: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const adminOtpGenerateAndSendController = async (req, resp) => {
  try {
    const response = await generateAndSendOtp(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error generating otp admin: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const adminOtpVerificationController = async (req, resp) => {
  try {
    const response = await verifyOtpOfAdmin(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error verifying otp admin: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const adminPasswordChangeController = async (req, resp) => {
  try {
    const response = await changePasswordForAdmin(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error change password admin: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const adminPasswordForgetController = async (req, resp) => {
  try {
    const response = await forgetPasswordForAdmin(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error forget password admin: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const onboardMerchantController = async (req, resp) => {
  try {
    const response = await onboardMerchant(req);
    return resp.status(201).send(response);
  } catch (error) {
    console.error("Error onboarding merchant: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const activeOrInActiveMerchantController = async (req, resp) => {
  try {
    const response = await activeOrInActiveMerchant(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error active/inactive merchant: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const getMerchantController = async (req, resp) => {
  try {
    const response = await getMerchantInfo(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error active/inactive merchant: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

export {
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
};
