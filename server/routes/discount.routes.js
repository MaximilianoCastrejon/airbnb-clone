import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import { authRequired } from "../middleware/token.validate.js";
import multer from "multer";
import * as route from "../controllers/discount.controllers.js";
const router = Router();

router.get("/code/doc/:id", handleAsyncError(route.getDiscount));
router.get("/code/docs/", handleAsyncError(route.getDiscounts));
router.post("/code/doc/", handleAsyncError(route.generateDiscountCode));
router.patch("/code/doc/:id", handleAsyncError(route.updateDiscount));
router.delete("/code/doc/:id", handleAsyncError(route.deleteDiscount));

/*************USER*************/
router.get(
  "/code/validate/user/:id",
  handleAsyncError(route.checkUserDiscountValidity)
);
router.get("/user/codes/", handleAsyncError(route.getUserCodes));
router.post("/user/code/", handleAsyncError(route.createUserCode));
router.delete(
  "/user/:user_id/code/:code_id",
  handleAsyncError(route.deleteUserCode)
);

/*************LISTING*************/
router.get(
  "/code/validate/listing/:id",
  handleAsyncError(route.checkListingDiscountValidity)
);
router.get("/listing/codes/", handleAsyncError(route.getListingCodes));
router.post("/listing/code/", handleAsyncError(route.createListingCode));
router.delete(
  "/listing/:listing_id/code/:code_id",
  handleAsyncError(route.deleteListingCode)
);

/*************BOOKING*************/
router.get(
  "/code/validate/booking/:id",
  handleAsyncError(route.checkBookingDiscountValidity)
);

export default router;
