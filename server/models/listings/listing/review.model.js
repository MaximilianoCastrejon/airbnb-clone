import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    response: {
      type: String,
    },
    isHostHighlight: {
      type: Boolean,
      default: false,
    },
    comments: {
      type: String,
      require: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listings",
      require: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      require: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 10 || value <= 0;
        },
        message: "Rating cannot fall outside of the 0-10 range",
      },
    },
    photos: {
      type: [String],
    },
    active: {
      type: Boolean,
      default: true,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
