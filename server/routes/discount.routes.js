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

/*************CRITERIA*************/

router.get("/criteria/components/:id", handleAsyncError(route.getCriterion));
router.get("/criteria/components/", handleAsyncError(route.getCriteria));
router.post("/criteria/components/", handleAsyncError(route.createCriterion));
router.patch(
  "/criteria/components/:id",
  handleAsyncError(route.updateCriterion)
);
router.delete(
  "/criteria/components/:id",
  handleAsyncError(route.deleteCriterion)
);

/*************USER*************/
router.get(
  "/code/validate/user/:id",
  handleAsyncError(route.checkUserDiscountValidity)
);

/*************LISTING*************/
router.get(
  "/code/validate/listing/:id",
  handleAsyncError(route.checkListingDiscountValidity)
);

/*************BOOKING*************/
router.get(
  "/code/validate/booking/:id",
  handleAsyncError(route.checkBookingDiscountValidity)
);

export default router;
