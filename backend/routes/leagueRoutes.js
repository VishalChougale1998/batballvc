// import express from "express";
// import League from "../models/League.js";

// const router = express.Router();

// // CREATE LEAGUE
// router.post("/", async (req, res) => {
//     const league = new League(req.body);
//     const saved = await league.save();
//     res.json(saved);
// });

// // GET ALL
// router.get("/", async (req, res) => {
//     const leagues = await League.find();
//     res.json(leagues);
// });

// export default router;
// ===========================

import express from "express";
import League from "../models/League.js";

const router = express.Router();


// ==========================
// CREATE LEAGUE
// ==========================
router.post("/", async (req, res) => {
    try {
        const league = new League(req.body);
        const saved = await league.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ==========================
// GET ALL LEAGUES
// ==========================
router.get("/", async (req, res) => {
    try {
        const leagues = await League.find().sort({ createdAt: -1 });
        res.json(leagues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ==========================
// GET SINGLE LEAGUE
// ==========================
router.get("/:id", async (req, res) => {
    try {
        const league = await League.findById(req.params.id);

        if (!league) {
            return res.status(404).json({ message: "League not found" });
        }

        res.json(league);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ==========================
// UPDATE LEAGUE
// ==========================
router.put("/:id", async (req, res) => {
    try {
        const updated = await League.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "League not found" });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ==========================
// DELETE LEAGUE  🔥 (YOUR FIX)
// ==========================
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await League.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "League not found" });
        }

        res.json({ message: "League deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;