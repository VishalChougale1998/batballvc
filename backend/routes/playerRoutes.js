import express from "express";
import mongoose from "mongoose";
import Player from "../models/Players.js";
const router = express.Router();

// ✅ CREATE PLAYER
router.post("/", async (req, res) => {
    try {
        const player = new Player(req.body);
        await player.save();
        res.json({ success: true, player });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET PLAYERS (by league)
router.get("/:leagueId", async (req, res) => {
    try {
        const { leagueId } = req.params;
        if (!leagueId || leagueId === 'undefined' || !mongoose.isValidObjectId(leagueId)) {
            return res.json([]);
        }
        const players = await Player.find({ leagueId });
        res.json(players);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/seed", async (req, res) => {
    await Player.insertMany([
        {
            name: "Virat",
            role: "Batsman",
            village: "Delhi",
            leagueId: "1",
            status: "unsold"
        },
        {
            name: "Dhoni",
            role: "Wicketkeeper",
            village: "Ranchi",
            leagueId: "1",
            status: "unsold"
        }
    ]);

    res.send("Players added ✅");
});

// ✅ DELETE PLAYER
router.delete("/:id", async (req, res) => {
    try {
        await Player.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
