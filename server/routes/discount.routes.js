import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import { authRequired } from "../middleware/token.validate.js";
import multer from "multer";
import * as route from "../controllers/discount.controllers.js";
const router = Router();

router.get("/code/:id", handleAsyncError(route.userDetails));
router.get("/codes", handleAsyncError(route.userDetails));
router.post("/code", handleAsyncError(route.userDetails));
router.patch("/code", handleAsyncError(route.userDetails));
router.delete("/code", handleAsyncError(route.userDetails));

router.get("/criteria/user/:id", handleAsyncError(route.userDetails));
router.get("/criteria/user/", handleAsyncError(route.userDetails));
router.post("/criteria/user/", handleAsyncError(route.userDetails));
router.put("/criteria/user/", handleAsyncError(route.userDetails));
router.delete("/criteria/user/", handleAsyncError(route.userDetails));

router.get("/criteria/listing/:id", handleAsyncError(route.listingDetails));
router.get("/criteria/listing/", handleAsyncError(route.listingDetails));
router.post("/criteria/listing/", handleAsyncError(route.listingDetails));
router.put("/criteria/listing/", handleAsyncError(route.listingDetails));
router.delete("/criteria/listing/", handleAsyncError(route.listingDetails));

router.get("/criteria/booking/:id", handleAsyncError(route.bookingDetails));
router.get("/criteria/booking/", handleAsyncError(route.bookingDetails));
router.post("/criteria/booking/", handleAsyncError(route.bookingDetails));
router.put("/criteria/booking/", handleAsyncError(route.bookingDetails));
router.delete("/criteria/booking/", handleAsyncError(route.bookingDetails));

export default router;
