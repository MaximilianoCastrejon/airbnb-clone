import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/room-type/:id", handleAsyncError(route.userDetails));
router.get("/room-types", handleAsyncError(route.userDetails));
router.post("/room-type", handleAsyncError(route.userDetails));
router.put("/room-type", handleAsyncError(route.userDetails));
router.delete("/room-type", handleAsyncError(route.userDetails));

export default router;
