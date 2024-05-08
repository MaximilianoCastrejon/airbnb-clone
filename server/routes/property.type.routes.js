import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/property-type/:id", handleAsyncError(route.userDetails));
router.get("/property-types", handleAsyncError(route.userDetails));
router.post("/property-type", handleAsyncError(route.userDetails));
router.put("/property-type", handleAsyncError(route.userDetails));
router.delete("/property-type", handleAsyncError(route.userDetails));

export default router;
