import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/draft.listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileFields = [{ name: "", maxcount: 1 }];

router.get("listings/:id", handleAsyncError(route.getDraftListings));
router.get("listings/", handleAsyncError(route.getDraftListings));
router.post("listings/", handleAsyncError(route.postDraftListing));
router.put("listings/:id", handleAsyncError(route.updateDraftListing));
router.delete("listings/:id", handleAsyncError(route.deleteDraftListing));

router.get("photos/:id", handleAsyncError(route.getDraftPhotos));
router.get("photos/", handleAsyncError(route.getDraftPhoto));
router.post(
  "photos/",
  upload.array("property_photos", 10),
  handleAsyncError(route.postDraftPhoto)
);
router.put("photos/:id", handleAsyncError(route.updateDraftPhoto));
router.delete("photos/:id", handleAsyncError(route.deleteDraftPhoto));

router.get("address/:id", handleAsyncError(route.getDraftAddress));
router.get("address/", handleAsyncError(route.getDraftAddress));
router.post("address/", handleAsyncError(route.postDraftListing));
router.put("address/:id", handleAsyncError(route.updateDraftListing));
router.delete("address/:id", handleAsyncError(route.deleteDraftListing));

export default router;
