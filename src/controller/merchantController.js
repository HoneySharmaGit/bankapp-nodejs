import {
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
    console.error("Error generating otp merchant: " + error);
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
    console.error("Error otp verification merchant: " + error);
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
    console.error("Error edit merchant: " + error);
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
    console.error("Error fetching merchant profile: " + error);
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
    console.error("Error merchant password change: " + error);
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
    console.error("Error merchant password forget: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const loadMoneyRequestController = async (req, resp) => {
  try {
    const response = await requestLoadMoney(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error merchant raising loadmoney request: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const allLoadMoneyRequestFetchController = async (req, resp) => {
  try {
    const response = await fetchAllLoadMoneyRequest(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error fetching all merchant loadmoney request: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const xClientIdAndXSecretIdCreationController = async (req, resp) => {
  try {
    const response = await generateNewXClientIdAndXSecretId(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error creating new xClientId and xSecretId: " + error);
    resp.send({
      message: "internal server error",
      error: error,
      status: "error",
      data: null,
    });
  }
};

const xClientIdAndXSecretIdFetchController = async (req, resp) => {
  try {
    const response = await fetchAllXClientIdAndXSecretId(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error fetching all xClientId and xSecretId: " + error);
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
  loadMoneyRequestController,
  allLoadMoneyRequestFetchController,
  xClientIdAndXSecretIdCreationController,
  xClientIdAndXSecretIdFetchController,
};
