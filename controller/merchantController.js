import { merchantLogin } from "../service/merchantService.js";

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

export { merchantLoginController };
