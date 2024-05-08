import mongoose from "mongoose";

// Entire place, room, shared room

const RoomTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    icon_svg: {
      type: String,
      require: true,
    },
    icon_image_url: {
      type: String,
      require: true,
    },
    active: {
      type: Boolean,
      default: true,
      require: true,
    },
  },
  { timestamps: true }
);

const RoomType = mongoose.model("RoomType", RoomTypeSchema);
export default RoomType;
