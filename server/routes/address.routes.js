import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import * as route from "../controllers/address.controllers.js";
const router = Router();

router.get("/doc/", handleAsyncError(route.getAddressess));
router.get("/doc/:id", handleAsyncError(route.getAddressDetails));
router.post("/doc/", handleAsyncError(route.createAddress));
router.patch("/doc/:id", handleAsyncError(route.updateAddress));
router.delete("/doc/:id", handleAsyncError(route.deleteAddress));

export default router;
