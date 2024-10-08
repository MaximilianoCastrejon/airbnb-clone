import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import Booking from "../models/listings/listing/management/booking.model.js";
import UserDiscountCode from "../models/user.discounts.model.js";
import DiscountCode from "../models/discount.code.model.js";
import Listing from "../models/listings/listing/listing.model.js";
import checkDiscountValidity from "../libs/validateDiscount.js";
import ListingDiscountCode from "../models/listing.discount.model.js";
import queryDocs from "../libs/queryDocs.js";


  res.cookie("priceLockToken", priceLockToken, { httpOnly: true });

  // Store the lock token and associated price in memory or database
  // You can also store it in a database if you prefer
  // priceLocks[priceLockToken] = { listingId, price };

  // Return a response indicating successful lock
  res.json({ message: "Price locked. Proceed to confirm booking." });
};

export const createBooking = async (req, res) => {
  const fields = req.body;
  const priceLockToken = req.cookies.priceLockToken;

  // decode priceLockToken if available. With list of discount codes
  // create booking for user, listing at price
  for (const discountCode of discountCodes) {
    const discount = await DiscountCode.findOne({ code: discountCode });
    await DiscountCode.findByIdAndUpdate(discount._id, {
      current_uses: discount.current_uses + 1,
    });
    await ListingDiscountCode.findOneAndUpdate(
      { discount_code_id: discount._id },
      { current_uses: listingDiscountFound.current_uses + 1 }
    );
    await UserDiscountCode.findOneAndUpdate(
      { discount_code_id: discount._id },
      { current_uses: userDiscountFound.current_uses + 1 }
    );
  }
};

export const getListingCalendar = async (req, res) => {
  const upcomingReservations = await Booking.find({
    check_in_date: { $gte: Date(now) },
  }).select("check_in_date check_out_date");
  res.status(StatusCodes.OK).json({});
};

export const getBookings = async (req, res) => {
  const { result, messages } = await queryDocs(Booking, req.query);
  if (!result) throw new async_errors.NotFoundError(messages.toString());
  console.log(result);
  res.status(StatusCodes.OK).json({ data: result });
};
