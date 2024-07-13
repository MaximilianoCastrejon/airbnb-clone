import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/auth.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/user/:id", handleAsyncError(route.userDetails));
router.get("/users", handleAsyncError(route.user));
router.get("/verify", handleAsyncError(route.verifyToken));
router.post(
  "/signup",
  upload.single("profile_image"),
  handleAsyncError(route.signup)
);
router.post("/login", handleAsyncError(route.login));
router.post("/logout", handleAsyncError(route.logout));

export default router;
