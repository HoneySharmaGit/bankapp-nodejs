import mongooes from "mongoose";
import validator from "validator";

const otpSchema = new mongooes.Schema({
  email: {
    type: String,
    required: true,
    unique: [true, "Email is already present"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  savedOtp: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const OtpEntity = new mongooes.model("otp", otpSchema);
export { OtpEntity };
