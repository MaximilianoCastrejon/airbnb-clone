import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/subcategory/:id", handleAsyncError(route.userDetails));
router.get("/subcategories", handleAsyncError(route.userDetails));
router.post("/subcategory", handleAsyncError(route.userDetails));
router.put("/subcategory", handleAsyncError(route.userDetails));
router.delete("/subcategory", handleAsyncError(route.userDetails));

export default router;
