import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import { authRequired } from "../middleware/token.validate.js";
import multer from "multer";
import * as route from "../controllers/listing.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/doc/:id", handleAsyncError(route.getListing));
router.get("/doc", handleAsyncError(route.getListings));
router.post("/doc", authRequired, handleAsyncError(route.postListing));
router.put("/doc", authRequired, handleAsyncError(route.updateListing));
router.delete("/doc", authRequired, handleAsyncError(route.deleteListing));

router.get("/review/:id", handleAsyncError(route.userDetails));
router.get("/reviews", handleAsyncError(route.userDetails));
router.post("/review", handleAsyncError(route.userDetails));
router.put("/review", handleAsyncError(route.userDetails));
router.delete("/review", handleAsyncError(route.userDetails));

router.get("/category/:id", handleAsyncError(route.getCategory));
router.get("/categories", handleAsyncError(route.queryCategories));
router.post("/category", handleAsyncError(route.createCategory));
router.patch("/category/:id", handleAsyncError(route.updateCategory));
router.delete("/category/:id", handleAsyncError(route.deleteCategory));

router.get("/sub-category/:id", handleAsyncError(route.userDetails));
router.get("/sub-categories", handleAsyncError(route.userDetails));
router.post("/sub-category", handleAsyncError(route.userDetails));
router.patch("/sub-category", handleAsyncError(route.userDetails));
router.delete("/sub-category", handleAsyncError(route.userDetails));

export default router;
