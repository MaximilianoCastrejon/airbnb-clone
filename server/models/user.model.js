import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    refered_by: {
      type: mongoose.Schema.Types.ObjectId,
      require: false,
      ref: "User",
    },
    username: {
      type: String,
      require: true,
    },
    middle_name: {
      type: String,
    },
    first_last_name: {
      type: String,
    },
    second_last_name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    profile_image: {
      type: String,
      require: true,
    },
    isSuperHost: {
      type: Boolean,
    },
    referal_code: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
