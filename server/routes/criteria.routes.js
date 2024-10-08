import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import { authRequired } from "../middleware/token.validate.js";
import * as route from "../controllers/criteria.controllers.js";
const router = Router();

/*************CRITERIA*************/

router.get("/:id", handleAsyncError(route.getCriterion));
router.get("/", handleAsyncError(route.getCriteria));
router.post("/", handleAsyncError(route.createCriterion));
router.patch("/:id", handleAsyncError(route.updateCriterion));
router.delete("/:id", handleAsyncError(route.deleteCriterion));

export default router;
