import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/adress/:id", handleAsyncError(route.userDetails));
router.post("/adress", handleAsyncError(route.userDetails));
router.put("/adress", handleAsyncError(route.userDetails));
router.delete("/adress", handleAsyncError(route.userDetails));

export default router;
