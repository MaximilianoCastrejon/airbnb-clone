import mongoose from "mongoose";

const ListingPhotoSchema = new mongoose.Schema(
  {
    image_url: {
      type: String,
      require: true,
    },
    listing_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      require: true,
    },
    added_by_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/**
 * At least 5 Photos must be chosen by business requirements
 */
ListingPhotoSchema.pre("save", function (next) {
  this.constructor.countDocuments(
    { listing_id: this.listing_id },
    (err, count) => {
      if (err) {
        return next(err);
      }

      if (count < 5) {
        const error = new Error(
          "There must be at least 5 Photos with the same listingId."
        );
        return next(error);
      }

      next();
    }
  );
});

ListingPhotoSchema.pre("updateOne", function (next) {
  const listing_id = this._update.$set.listing_id;

  this.model.countDocuments({ listing_id }, (err, count) => {
    if (err) {
      return next(err);
    }

    if (count < 5) {
      const error = new Error(
        "There must be at least 5 Photos with the same listingId."
      );
      return next(error);
    }

    next();
  });
});

const ListingPhoto = mongoose.model("ListingPhoto", ListingPhotoSchema);
export default ListingPhoto;
