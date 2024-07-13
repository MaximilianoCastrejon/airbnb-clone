import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import * as routes from "../controllers/finance.controllers.js";
const router = Router();

router.get("/currency/:id", handleAsyncError(routes.getCurrency));
router.get("/currencies", handleAsyncError(routes.getCurrencies));
router.post("/currency", handleAsyncError(routes.postCurrency));
router.put("/currency", handleAsyncError(routes.updateCurrency));
router.delete("/currency", handleAsyncError(routes.deleteCurrency));

export default router;
