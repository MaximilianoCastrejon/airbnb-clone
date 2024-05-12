import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
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
    // Update USER whenever user click to create a new listing to grant access to host panel
    // is_host: {
    //   type: Boolean,
    //   default: false,
    // },
    listings: {
      type: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
