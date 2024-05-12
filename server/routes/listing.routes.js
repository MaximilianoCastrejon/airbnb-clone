import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import { authRequired } from "../middleware/token.validate.js";
import multer from "multer";
import * as route from "../controllers/listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/:id", handleAsyncError(route.getListing));
router.get("", handleAsyncError(route.getListings));
router.post("", authRequired, handleAsyncError(route.postListing));
router.put("", authRequired, handleAsyncError(route.updateListpostListing));
router.delete("", authRequired, handleAsyncError(route.deleteListpostListing));

router.get("/review/:id", handleAsyncError(route.userDetails));
router.get("/reviews", handleAsyncError(route.userDetails));
router.post("/review", handleAsyncError(route.userDetails));
router.put("/review", handleAsyncError(route.userDetails));
router.delete("/review", handleAsyncError(route.userDetails));

export default router;
