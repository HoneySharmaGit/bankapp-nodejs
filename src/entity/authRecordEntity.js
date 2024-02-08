import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const authRecordSchema = mongoose.Schema({
  merchantId: {
    type: String,
    required: true,
  },
  xClientId: {
    type: String,
    default: uuidv4,
    required: true,
  },
  xSecretId: {
    type: String,
    default: uuidv4,
    required: true,
  },
  createdAt: {
    type: Date,
    value: Date.now(),
  },
  isExpired: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const AuthRecordEntity = new mongoose.model("authRecords", authRecordSchema);

export { AuthRecordEntity };
