import mongoose from "mongoose";

const uri = "mongodb+srv://root:dinga@cluster0.8yi3c9e.mongodb.net/crud";

const uri1 = "mongodb://localhost:27017/crud";

async function connectToDatabase() {
  const response = await mongoose.connect(uri1);
  console.log("connected successfully with local mongo DB....");
}

export { connectToDatabase };
