import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/user.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("doc/", handleAsyncError(route.getUsers));
router.get("doc/:id", handleAsyncError(route.getUserDetails));
router.patch(
  "doc/:id",
  upload.single("profile_image"),
  handleAsyncError(route.updateUser)
);
router.delete("doc/:id", handleAsyncError(route.deleteUser));

router.get("/doc/:id/address/", handleAsyncError(route.getUserAddress));
router.post("/doc/:id/address/", handleAsyncError(route.createUserAddress));
router.patch("/doc/:id/address/", handleAsyncError(route.updateUserAddress));
router.delete("/doc/:id/address/", handleAsyncError(route.deleteUserAddress));

export default router;
