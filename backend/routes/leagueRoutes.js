import express from "express";
import League from "../models/League.js";

const router = express.Router();

// CREATE LEAGUE
router.post("/", async (req, res) => {
    const league = new League(req.body);
    const saved = await league.save();
    res.json(saved);
});

// GET ALL
router.get("/", async (req, res) => {
    const leagues = await League.find();
    res.json(leagues);
});

export default router;