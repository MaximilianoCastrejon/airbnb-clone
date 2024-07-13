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
    cleanliness_score: {
      type: Number,
      require: true,
      validate: {
        validator: function (value) {
          return value >= 5 || value <= 0;
        },
        message: "Value cannot fall outside of the 0-5 range",
      },
    },
    accuracy_score: {
      type: Number,
      require: true,
      validate: {
        validator: function (value) {
          return value >= 5 || value <= 0;
        },
        message: "Value cannot fall outside of the 0-5 range",
      },
    },
    checkIn_score: {
      type: Number,
      require: true,
      validate: {
        validator: function (value) {
          return value >= 5 || value <= 0;
        },
        message: "Value cannot fall outside of the 0-5 range",
      },
    },
    communication_score: {
      type: Number,
      require: true,
      validate: {
        validator: function (value) {
          return value >= 5 || value <= 0;
        },
        message: "Value cannot fall outside of the 0-5 range",
      },
    },
    location_score: {
      type: Number,
      require: true,
      validate: {
        validator: function (value) {
          return value >= 5 || value <= 0;
        },
        message: "Value cannot fall outside of the 0-5 range",
      },
    },
    value_score: {
      type: Number,
      require: true,
      validate: {
        validator: function (value) {
          return value >= 5 || value <= 0;
        },
        message: "Value cannot fall outside of the 0-5 range",
      },
    },
    rating: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 5 || value <= 0;
        },
        message: "Rating cannot fall outside of the 0-5 range",
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
