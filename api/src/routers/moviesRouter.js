import express from "express";
import { getProducersWithAwardIntervals } from "../controllers/moviesController.js";

const router = express.Router();

router.get("/awards/intervals", async (req, res) => {
  try {
    const result = await getProducersWithAwardIntervals();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate award intervals!" });
  }
});

export { router };
