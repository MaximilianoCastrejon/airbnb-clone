import { Router } from "express";
import { handleAsyncError } from "../middleware/error-handler.middleware.js";
import multer from "multer";
import * as route from "../controllers/geo.controllers.js";
const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/address/:id", handleAsyncError(route.getAddress));
router.get("/addresses/", handleAsyncError(route.getAddresses));
router.post("/address/", handleAsyncError(route.postAddress));
router.put("/address/", handleAsyncError(route.updateAddress));
router.delete("/address/", handleAsyncError(route.deleteAddress));

router.get("/country/:id", handleAsyncError(route.getCountry));
router.get("/countries/", handleAsyncError(route.getCountries));
router.post("/country/", handleAsyncError(route.postCountry));
router.put("/country/", handleAsyncError(route.updateCountry));
router.delete("/country/", handleAsyncError(route.deleteCountry));

router.get("/state/:id", handleAsyncError(route.getState));
router.get("/states/", handleAsyncError(route.getStates));
router.post("/state/", handleAsyncError(route.postState));
router.put("/state/", handleAsyncError(route.updateState));
router.delete("/state/", handleAsyncError(route.deleteState));

router.get("/municipality/:id", handleAsyncError(route.getMunicipality));
router.get("/municipalities/", handleAsyncError(route.getMunicipalities));
router.post("/municipality/", handleAsyncError(route.postMunicipality));
router.put("/municipality/", handleAsyncError(route.updateMunicipality));
router.delete("/municipality/", handleAsyncError(route.deleteMunicipality));

router.get("/city/:id", handleAsyncError(route.getCity));
router.get("/cities/", handleAsyncError(route.getCities));
router.post("/city/", handleAsyncError(route.postCity));
router.put("/city/", handleAsyncError(route.updateCity));
router.delete("/city/", handleAsyncError(route.deleteCity));

export default router;
