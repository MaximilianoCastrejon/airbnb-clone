import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware";
import * as route from "../host.controllers.js";

const router = Router();

router.get("/co-host/key", handleAsyncError(route.generateCohostKey));

export default reouter;
