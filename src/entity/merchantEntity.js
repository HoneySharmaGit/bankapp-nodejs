import mongooes from "mongoose";
import validator from "validator";
import crypto from "crypto";

const MerchantSchema = new mongooes.Schema({
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  firstName: {
    type: String,
    required: true,
    length: 20,
  },
  lastName: {
    type: String,
    required: true,
    length: 30,
  },
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
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    required: false,
  },
  role: {
    type: String,
    enum: ["merchant"],
    default: "merchant",
    adminId: {
      type: String,
      required: true,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  address: {
    type: String,
    required: false,
  },
  merchantId: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    length: 10,
    required: true,
  },
  ifscCode: {
    type: String,
    required: false,
  },
  accountNumber: {
    type: String,
    required: false,
  },
  gstNumber: {
    type: String,
    required: false,
  },
});

const MerchantEntity = new mongooes.model("merchant", MerchantSchema);
export { MerchantEntity };
