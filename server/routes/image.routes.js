import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/image/:id", handleAsyncError(route.userDetails));
router.get("/images", handleAsyncError(route.userDetails));
router.post("/image", handleAsyncError(route.userDetails));
router.put("/image", handleAsyncError(route.userDetails));
router.delete("/image", handleAsyncError(route.userDetails));

export default router;
