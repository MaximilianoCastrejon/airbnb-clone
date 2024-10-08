import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import * as async_errors from "../errors/errors.barrel.js";
import Booking from "../models/listings/listing/management/booking.model.js";
import UserDiscountCode from "../models/user.discounts.model.js";
import DiscountCode from "../models/discount.code.model.js";
import ListingDiscountCode from "../models/listing.discount.model.js";
import bookingCheckoutDiscountValidity from "../libs/validateDiscount.js";
import { generatePriceLockToken } from "../libs/createPriceLockJWT.js";
import createDocument from "../libs/createDocument.js";
import queryDocs from "../libs/queryDocs.js";

export const quoteBookingPriceWithDiscounts = async (req, res) => {
  const { user_id, listing_id } = req.params;
  const { context } = req.body;
  const validCodes = await bookingCheckoutDiscountValidity(
    user_id,
    listing_id,
    context
  );
  let totalCost = context.total_reservation_cost;
  for (const code of validCodes) {
    totalCost = 1 - code.discount;
  }
  context.total_reservation_cost = totalCost;
  const valid_code_ids = validCodes.filter((code) => code._id);
  const price_locked_token = generatePriceLockToken({
    listing_id,
    user_id,
    valid_code_ids,
    totalCost,
  });

  res.cookie("price_locked_token", price_locked_token, { httpOnly: true });

  res.status(StatusCodes.OK).json(context);
};

export const createBooking = async (req, res) => {
  const { user_id, listing_id, totalCost, valid_code_ids } = req;
  const { fields } = req.body;
  if (!user_id || !listing_id || !totalCost)
    throw new async_errors.BadRequestError(
      "Before creating a reservation, you must first lock the price"
    );

  const booking = await createDocument(Booking, {
    guest_id: user_id,
    listing_id,
    total_discounted_reservation_cost: totalCost,
    fields,
  });
  if (!booking)
    throw new Error("Reservation could not be processed. Try again later");

  for (const code of valid_code_ids) {
    await DiscountCode.findByIdAndUpdate(code, {
      $inc: { current_uses: 1 },
    });
    await ListingDiscountCode.findOneAndUpdate(
      { discount_code_id: code, listing_id },
      { $inc: { current_uses: 1 } }
    );
    await UserDiscountCode.findOneAndUpdate(
      { discount_code_id: code, user_id },
      { $inc: { current_uses: 1 } }
    );
  }
  res.status(StatusCodes.OK).json(booking);
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
