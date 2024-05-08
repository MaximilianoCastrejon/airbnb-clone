import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/encounter/:id", handleAsyncError(route.userDetails));
router.get("/encounters", handleAsyncError(route.userDetails));
router.post("/encounter", handleAsyncError(route.userDetails));
router.put("/encounter", handleAsyncError(route.userDetails));
router.delete("/encounter", handleAsyncError(route.userDetails));

export default router;
