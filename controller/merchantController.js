import {
  merchantLogin,
  generateAndSendOtp,
  verifyOtpOfMerchant,
  editMerchant,
  getMerchantProfile,
  changePasswordForMerchant,
  forgetPasswordForMerchant,
} from "../service/merchantService.js";

const merchantLoginController = async (req, resp) => {
  try {
    const response = await merchantLogin(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error merchant login: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const merchantOtpGenerateAndSendController = async (req, resp) => {
  try {
    const response = await generateAndSendOtp(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error merchant login: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const merchantOtpVerificationController = async (req, resp) => {
  try {
    const response = await verifyOtpOfMerchant(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error merchant login: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const editMerchantController = async (req, resp) => {
  try {
    const response = await editMerchant(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error merchant login: " + error);
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
    const response = await getMerchantProfile(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error merchant login: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const merchantPasswordChangeController = async (req, resp) => {
  try {
    const response = await changePasswordForMerchant(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error merchant login: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const merchantPasswordForgetController = async (req, resp) => {
  try {
    const response = await forgetPasswordForMerchant(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error merchant login: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

export {
  merchantLoginController,
  merchantOtpGenerateAndSendController,
  merchantOtpVerificationController,
  editMerchantController,
  getMerchantController,
  merchantPasswordChangeController,
  merchantPasswordForgetController,
};
