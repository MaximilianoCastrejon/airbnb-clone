import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import { authRequired } from "../middleware/token.validate.js";
import * as route from "../controllers/booking.controllers.js";
const router = Router();

router.get("/:id", handleAsyncError(route.userDetails));
router.get("", handleAsyncError(route.getBookings));
router.post("", handleAsyncError(route.userDetails));
router.put("", handleAsyncError(route.userDetails));
router.delete("", handleAsyncError(route.userDetails));

export default router;
