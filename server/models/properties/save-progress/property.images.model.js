import mongoose from "mongoose";

const PropertyImageSchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
    },
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    added_by_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * At least 5 images must be chosen by business requirements
 */
PropertyImageSchema.pre("save", function (next) {
  this.constructor.countDocuments(
    { property_id: this.property_id },
    (err, count) => {
      if (err) {
        return next(err);
      }

      if (count < 5) {
        const error = new Error(
          "There must be at least 5 images with the same propertyId."
        );
        return next(error);
      }

      next();
    }
  );
});

PropertyImageSchema.pre("updateOne", function (next) {
  const property_id = this._update.$set.property_id;

  this.model.countDocuments({ property_id }, (err, count) => {
    if (err) {
      return next(err);
    }

    if (count < 5) {
      const error = new Error(
        "There must be at least 5 images with the same propertyId."
      );
      return next(error);
    }

    next();
  });
});

const PropertyImage = mongoose.model("PropertyImage", PropertyImageSchema);
export default PropertyImage;
