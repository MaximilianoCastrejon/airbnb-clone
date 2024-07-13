import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/photo.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/:id", handleAsyncError(route.userDetails));
router.get("/", handleAsyncError(route.userDetails));
router.post("/", upload.array("photo", 10), handleAsyncError(route.postPhoto));
router.put("/", handleAsyncError(route.userDetails));
router.delete("/", handleAsyncError(route.userDetails));

export default router;
