import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import { authRequired } from "../middleware/token.validate.js";
import multer from "multer";
import * as route from "../controllers/property.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/:id", handleAsyncError(route.getProperty));
router.get("", handleAsyncError(route.getProperties));
router.post("", authRequired, handleAsyncError(route.postProperty));
router.put("", authRequired, handleAsyncError(route.updateProperty));
router.delete("", authRequired, handleAsyncError(route.deleteProperty));

router.get("/review/:id", handleAsyncError(route.userDetails));
router.get("/reviews", handleAsyncError(route.userDetails));
router.post("/review", handleAsyncError(route.userDetails));
router.put("/review", handleAsyncError(route.userDetails));
router.delete("/review", handleAsyncError(route.userDetails));

export default router;
