import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// SAME SCHEMA (needed here)
import League from "../models/League.js";

// CREATE
router.post("/", async (req, res) => {
    try {
        const league = new League(req.body);
        const saved = await league.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET ALL
router.get("/", async (req, res) => {
    try {
        const leagues = await League.find().sort({ createdAt: -1 });
        res.json(leagues);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET ONE
router.get("/:id", async (req, res) => {
    try {
        const league = await League.findById(req.params.id);
        if (!league) return res.status(404).json({ message: "Not found" });
        res.json(league);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE
router.put("/:id", async (req, res) => {
    try {
        const updated = await League.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE ✅
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await League.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;