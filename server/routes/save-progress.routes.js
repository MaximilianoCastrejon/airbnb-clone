import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/process/price/:id", handleAsyncError(route.userDetails));
router.post("/process/price", handleAsyncError(route.userDetails));
router.put("/process/price", handleAsyncError(route.userDetails));
router.delete("/process/price", handleAsyncError(route.userDetails));

router.get("/progress/address/:id", handleAsyncError(route.userDetails));
router.get("/progress/addresss", handleAsyncError(route.userDetails));
router.post("/progress/address", handleAsyncError(route.userDetails));
router.put("/progress/address", handleAsyncError(route.userDetails));
router.delete("/progress/address", handleAsyncError(route.userDetails));

router.get("/progress/image/:id", handleAsyncError(route.userDetails));
router.get("/progress/images", handleAsyncError(route.userDetails));
router.post("/progress/image", handleAsyncError(route.userDetails));
router.put("/progress/image", handleAsyncError(route.userDetails));
router.delete("/progress/image", handleAsyncError(route.userDetails));

router.get("/progress/property/:id", handleAsyncError(route.userDetails));
router.get("/progress/propertys", handleAsyncError(route.userDetails));
router.post("/progress/property", handleAsyncError(route.userDetails));
router.put("/progress/property", handleAsyncError(route.userDetails));
router.delete("/progress/property", handleAsyncError(route.userDetails));

export default router;
