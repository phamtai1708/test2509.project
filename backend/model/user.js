import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  userId: String,
});
const UserModel = mongoose.model("users", userSchema);
export default UserModel;
