import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import * as route from "../controllers/booking.controllers.js";
import { priceLock } from "../middleware/pricelock.validate.js";
const router = Router();

router.get("/:id", handleAsyncError(route.userDetails));
router.get("", handleAsyncError(route.getBookings));
router.post("", priceLock, handleAsyncError(route.createBooking));
router.patch("", handleAsyncError(route.userDetails));
router.delete("", handleAsyncError(route.userDetails));

export default router;
