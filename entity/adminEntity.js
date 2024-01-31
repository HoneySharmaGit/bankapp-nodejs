import mongooes from "mongoose";
import validator from "validator";

const AdminSchema = new mongooes.Schema({
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
    enum: ["admin", "sub-admin"],
    default: "admin",
    adminId: {
      type: String,
      required: true,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const AdminEntity = new mongooes.model("admin", AdminSchema);
export { AdminEntity };
