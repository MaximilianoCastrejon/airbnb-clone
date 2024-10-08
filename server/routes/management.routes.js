import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/booking.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/booking/:id", handleAsyncError(route.userDetails));
router.get("/bookings", handleAsyncError(route.getBookings));
router.post("/booking", handleAsyncError(route.userDetails));
router.put("/booking", handleAsyncError(route.userDetails));
router.delete("/booking", handleAsyncError(route.userDetails));

router.get("/dispute/:id", handleAsyncError(route.userDetails));
router.get("/disputes", handleAsyncError(route.userDetails));
router.post("/dispute", handleAsyncError(route.userDetails));
router.put("/dispute", handleAsyncError(route.userDetails));
router.delete("/dispute", handleAsyncError(route.userDetails));

router.get("/transaction/:id", handleAsyncError(route.userDetails));
router.get("/transactions", handleAsyncError(route.userDetails));
router.post("/transaction", handleAsyncError(route.userDetails));
router.put("/transaction", handleAsyncError(route.userDetails));
router.delete("/transaction", handleAsyncError(route.userDetails));

export default router;
