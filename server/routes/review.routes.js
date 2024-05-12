import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/reviews.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/review/:id", handleAsyncError(route.userDetails));
router.get("/reviews", handleAsyncError(route.userDetails));
router.post("/review", handleAsyncError(route.userDetails));
router.put("/review", handleAsyncError(route.userDetails));
router.delete("/review", handleAsyncError(route.userDetails));

export default router;
