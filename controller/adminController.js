import { MongoAWSError } from "mongodb";
import {
  registerAdmin,
  editAdmin,
  getAdmin,
  adminLogin,
  generateAndSendOtp,
  verifyOtpByAdmin,
  changePasswordForAdmin,
  forgetPasswordForAdmin,
} from "../service/adminService.js";

const registerAdminController = async (req, resp) => {
  try {
    const response = await registerAdmin(req);
    return resp.status(201).send(response);
  } catch (error) {
    console.error("Error creating admin:", error);
    resp.send({
      message: "internal server error: " + error,
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
      message: "internal server error: " + error,
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
      message: "internal server error: " + error,
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
    console.error("Error fetching admin: " + error);
    resp.send({
      message: "internal server error: " + error,
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
    console.error("Error fetching admin: " + error);
    resp.send({
      message: "internal server error: " + error,
      status: "error",
      data: null,
    });
  }
};

const adminOtpVerificationController = async (req, resp) => {
  try {
    const response = await verifyOtpByAdmin(req);
    return resp.status(200).send(response);
  } catch (error) {
    console.error("Error fetching admin: " + error);
    resp.send({
      message: "internal server error: " + error,
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
    console.error("Error fetching admin: " + error);
    resp.send({
      message: "internal server error: " + error,
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
    console.error("Error fetching admin: " + error);
    resp.send({
      message: "internal server error: " + error,
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
};
