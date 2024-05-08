import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/property.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  "user/:user_id/property/progress/:id",
  handleAsyncError(route.getProperty)
);
router.post(
  "user/:user_id/property/progress",
  handleAsyncError(route.postProperty)
);
router.put(
  "user/:user_id/property/progress/:id",
  handleAsyncError(route.updateProperty)
);
router.delete(
  "user/:user_id/property/progress/:id",
  handleAsyncError(route.deleteProperty)
);

export default router;
