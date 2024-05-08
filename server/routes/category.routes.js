import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/category/:id", handleAsyncError(route.userDetails));
router.get("/categories", handleAsyncError(route.userDetails));
router.post("/category", handleAsyncError(route.userDetails));
router.put("/category", handleAsyncError(route.userDetails));
router.delete("/category", handleAsyncError(route.userDetails));

export default router;
