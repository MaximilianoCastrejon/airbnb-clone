import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/amenity/:id", handleAsyncError(route.userDetails));
router.get("/amenities", handleAsyncError(route.userDetails));
router.post("/amenity", handleAsyncError(route.userDetails));
router.put("/amenity", handleAsyncError(route.userDetails));
router.delete("/amenity", handleAsyncError(route.userDetails));

export default router;
