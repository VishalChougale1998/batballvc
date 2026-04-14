import express from "express";
import mongoose from "mongoose";
import Team from "../models/Team.js";
import Player from "../models/Players.js";

const router = express.Router();


// ================================
// ✅ GET TEAM WITH PLAYERS (FIRST)
// ================================
router.get("/with-players/:leagueId", async (req, res) => {
    try {
        const { leagueId } = req.params;

        if (!mongoose.isValidObjectId(leagueId)) {
            return res.json([]);
        }

        const teams = await Team.find({ leagueId })
            .populate("players.playerId");

        res.json(teams);

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});


// ================================
// 🔥 SELL PLAYER
// ================================
router.post("/add-player", async (req, res) => {
    try {
        const { teamId, playerId, price } = req.body;

        const team = await Team.findById(teamId);
        const player = await Player.findById(playerId);

        if (!team || !player) {
            return res.status(404).json({ msg: "Not found" });
        }

        if (player.status === "sold") {
            return res.status(400).json({ msg: "Already sold" });
        }

        if (team.purse < price) {
            return res.status(400).json({ msg: "Low balance" });
        }

        player.status = "sold";
        player.teamId = teamId;
        player.price = price;
        await player.save();

        team.players.push({ playerId, price });
        team.purse -= price;
        await team.save();

        res.json({ success: true });

    } catch {
        res.status(500).json({ msg: "Server error" });
    }
});


// ================================
// 🔥 UNSOLD PLAYER
// ================================
router.post("/remove-player", async (req, res) => {
    try {
        const { teamId, playerId } = req.body;

        const team = await Team.findById(teamId);
        const player = await Player.findById(playerId);

        if (!team || !player) {
            return res.status(404).json({ msg: "Not found" });
        }

        const entry = team.players.find(
            p => p.playerId.toString() === playerId
        );

        if (!entry) {
            return res.status(400).json({ msg: "Player not in team" });
        }

        // refund
        team.purse += entry.price;

        // remove from team
        team.players = team.players.filter(
            p => p.playerId.toString() !== playerId
        );

        // update player
        player.status = "unsold";
        player.teamId = null;
        player.price = 0;

        await player.save();
        await team.save();

        res.json({ success: true });

    } catch {
        res.status(500).json({ msg: "Server error" });
    }
});


// ================================
// ✅ CREATE TEAM
// ================================
router.post("/", async (req, res) => {
    try {
        const { name, purse, leagueId } = req.body;

        const newTeam = new Team({
            name,
            purse: Number(purse) || 50000,
            leagueId,
            players: []
        });

        await newTeam.save();
        res.json(newTeam);

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});


// ================================
// ❌ DELETE TEAM
// ================================
router.delete("/:id", async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        res.json({ msg: "Deleted" });

    } catch {
        res.status(500).json({ msg: "Error" });
    }
});


// ================================
// ✅ GET TEAMS (KEEP LAST)
// ================================
router.get("/:leagueId", async (req, res) => {
    try {
        const { leagueId } = req.params;

        if (!mongoose.isValidObjectId(leagueId)) {
            return res.json([]);
        }

        const teams = await Team.find({ leagueId });
        res.json(teams);

    } catch {
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;