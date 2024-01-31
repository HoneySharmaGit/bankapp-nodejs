import mongooes from "mongoose";
import validator from "validator";

const AdminSchema = new mongooes.Schema({
  balance: {
    type: Number,
    required: true,
    default: 0,
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
});

const Admin = new mongooes.model("admin", AdminSchema);
export { Admin };
