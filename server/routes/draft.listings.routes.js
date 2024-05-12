import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/draft.listings.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  "user/:user_id/draft-listings/progress/:id",
  handleAsyncError(route.getDraftListings)
);
router.post(
  "user/:user_id/draft-listings/progress",
  handleAsyncError(route.postDraftListings)
);
router.put(
  "user/:user_id/draft-listings/progress/:id",
  handleAsyncError(route.updateDraftListings)
);
router.delete(
  "user/:user_id/draft-listings/progress/:id",
  handleAsyncError(route.deleteDraftListings)
);

export default router;
