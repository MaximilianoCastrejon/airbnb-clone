import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/price/:id", handleAsyncError(route.userDetails));
router.get("/prices", handleAsyncError(route.userDetails));
router.post("/price", handleAsyncError(route.userDetails));
router.put("/price", handleAsyncError(route.userDetails));
router.delete("/price", handleAsyncError(route.userDetails));

export default router;
