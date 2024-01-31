import { MongoAWSError } from "mongodb";
import {
  registerAdmin,
  editAdmin,
  getAdmin,
  adminLogin,
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

export {
  registerAdminController,
  editAdminController,
  getAdminController,
  adminLoginController,
};
