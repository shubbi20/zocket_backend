import mongoose from "mongoose";

const Schema = mongoose.Schema;

const authSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 7,
    maxLength: 24,
  },
  password: { type: String, required: true, minLength: 5 },
});

const authModel = mongoose.model("Auth", authSchema);
export default authModel;
