import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    minLength: 7,
    maxLength: 24,
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
