import express from "express";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
const app = express();

dotenv.config();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://127.0.0.1:5173" }));
app.use(cookieParser());
app.use(errorHandler);

app.use("/auth", authRouter);

export default app;
