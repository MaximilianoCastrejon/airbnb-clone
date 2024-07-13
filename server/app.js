import express from "express";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import authRouter from "./routes/auth.routes.js";
import listingRouter from "./routes/listing.routes.js";
import draftRouter from "./routes/draft.listings.routes.js";
import geoRouter from "./routes/geo.routes.js";
import photoRouter from "./routes/photo.routes.js";
import financeRouter from "./routes/finance.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import discountRouter from "./routes/discount.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173" }));
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/photos", photoRouter);
app.use("/listings", listingRouter);
app.use("/bookings", bookingRouter);
app.use("/draft", draftRouter);
app.use("/finance", financeRouter);
app.use("/geo", geoRouter);
app.use("/discount", discountRouter);
// app.use("/business", businessRouter);
app.use(errorHandler);

export default app;
