import { StatusCodes } from "http-status-codes";
import { buildQuery } from "../libs/buildQuery.js";
import Booking from "../models/listings/listing/management/booking.model.js";
import UserDiscountCode from "../models/user.discounts.model.js";
import DiscountCode from "../models/discount.code.model.js";
import Listing from "../models/listings/listing/listing.model.js";
import checkDiscountValidity from "../libs/validateDiscount.js";
import ListingDiscountCode from "../models/listing.discount.model.js";

export const quotePrice = async (req, res) => {
  // listingId, userId, price, ...other_booking_fields
  const { bookingContext } = req.body;

  const userDiscounts = await UserDiscountCode.find({
    user_id: bookingContext.user_id,
  });
  const listingCodes = await ListingDiscountCode.find({
    listingId: bookingContext.listing_id,
  }).select("discountCodeId");

  let finalPrice = bookingContext.total_reservation_cost;
  let matchedCodes = [];
  for (const code of userDiscounts) {
    const match = listingCodes.find((discount_code) => {
      if (
        code.maxUses > code.currentUses &&
        discount_code === code.discountCodeId
      )
        return code.discountCodeId;
    });
    if (match) {
      matchedCodes.push(match);
      const discount = DiscountCode.findOne({ code: match });
      if (
        discount &&
        Date.now() < discount.expirationDate &&
        Date.now() > discount.startDate
      ) {
        const chargablePercentage = 1 - discount.discount;
        finalPrice *= chargablePercentage;
      }
    }
  }

  // Porcess booking discounts
  // Check if criteria from matchedCodes array is valid for Booking
  let isBookingEligible;
  for (const code of matchedCodes) {
    isBookingEligible = await checkDiscountValidity(
      bookingContext,
      code,
      "bookingCriteria",
      "BookingCriteria"
    );
    if (isBookingEligible) {
      const discount_code = await DiscountCode.findById(code);
      if (!discount_code) {
        console.log(`Discount code with id "${code}" could not be found`);
      } else {
        const chargablePercentage = 1 - discount_code.discount;
        finalPrice *= chargablePercentage;
      }
    }
  }

  bookingContext.total_discounted_reservation_cost = finalPrice;

  res.status(StatusCodes.OK).json(bookingContext);
};

const priceLock = (req, res) => {
  // Receive jwt with discounts
  const { listingId, userId, price } = req.body;

  const priceLockToken = generatePriceLockToken({ listingId, userId, price });

  res.cookie("priceLockToken", priceLockToken, { httpOnly: true });

  // Store the lock token and associated price in memory or database
  // You can also store it in a database if you prefer
  // priceLocks[priceLockToken] = { listingId, price };

  // Return a response indicating successful lock
  res.json({ message: "Price locked. Proceed to confirm booking." });
};

const postBooking = (req, res) => {
  const fields = req.body;
  const priceLockToken = req.cookies.priceLockToken;

  // decode priceLockToken if available
  // create booking fpr user, listing at price
};

export const getListingCalendar = async (req, res) => {
  const upcomingReservations = await Booking.find({
    check_in_date: { $gte: Date(now) },
  }).select("check_in_date check_out_date");
  res.status(StatusCodes.OK).json({});
};

export const getBookings = async (req, res) => {
  const {
    query,
    numericFilters,
    projection,
    sort,
    page,
    offset,
    populate,
    count,
  } = req.query;

  const structureQuery = {
    ...(projection && { projection }),
    ...(page && offset && { pagination: { page, limit: offset } }),
    ...(sort && { sort }),
    ...(populate && { populate }),
  };

  // const result = await buildQuery(Booking, {
  //   query: query,
  //   numericFilters: numericFilters,
  //   structure: structureQuery,
  //   count: count,
  // });
  const result = count ? 0 : [];
  res.status(StatusCodes.OK).json(result);
};
