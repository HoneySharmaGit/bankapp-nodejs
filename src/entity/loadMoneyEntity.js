import mongooes from "mongoose";
import validator from "validator";

const loadMoneySchema = new mongooes.Schema({
  merchantId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  merchantAccountNumber: {
    type: String,
    required: true,
  },
  merchantBankName: {
    type: String,
    required: true,
  },
  merchantIfscCode: {
    type: String,
    required: true,
  },
  adminAccountNumber: {
    type: String,
    required: true,
  },
  adminBankName: {
    type: String,
    required: true,
  },
  referenceUtr: {
    type: String,
    required: true,
    unique: true,
  },
  remarks: {
    type: String,
    required: false,
  },
  requestDate: {
    type: Date,
    value: Date.now(),
    required: true,
  },
  actionTakenDate: {
    type: Date,
  },
  status: {
    type: String,
    default: "pending",
    required: true,
  },
});

const LoadMoneyEntity = new mongooes.model("loadmoney", loadMoneySchema);

export { LoadMoneyEntity };
