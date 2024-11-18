import express from "express";
import "express-async-errors";
import cors from "cors";

import { router as moviesRouter } from "./routers/moviesRouter.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/movies", moviesRouter);

export { app };
