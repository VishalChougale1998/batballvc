import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import paymentRoutes from "./routes/payment.js";

const app = express();

/* ================= PATH ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= CLOUDINARY ================= */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// ✅ DEBUG LOG (YOU WANTED THIS)
console.log("Cloudinary ENV:", {
    name: process.env.CLOUD_NAME,
    key: process.env.API_KEY,
    secret: process.env.API_SECRET ? "OK" : "MISSING",
});

// STORAGE
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "auction_app",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

const upload = multer({ storage });

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= DB ================= */
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Mongo Error:", err));

/* ================= MODELS ================= */

const League = mongoose.model(
    "League",
    new mongoose.Schema(
        {
            name: String,
            village: String,
            slug: String,
            banner: String,
            entryFee: Number,
            lastDate: Date,
        },
        { timestamps: true }
    )
);

const Player = mongoose.model(
    "Player",
    new mongoose.Schema(
        {
            name: String,
            role: String,
            village: String,
            mobile: String,
            leagueId: String,
            photo: String,
            tshirtSize: String,
            pantSize: String,
            status: { type: String, default: "unsold" },
            teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
            price: Number,
        },
        { timestamps: true }
    )
);

const Team = mongoose.model(
    "Team",
    new mongoose.Schema(
        {
            name: String,
            purse: Number,
            leagueId: String,
            players: [
                {
                    playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
                    price: Number,
                },
            ],
        },
        { timestamps: true }
    )
);

/* ================= ROUTES ================= */

app.get("/", (req, res) => res.send("API running"));

/* ---------- CREATE LEAGUE ---------- */
app.post("/api/create-league", upload.single("banner"), async (req, res) => {
    try {
        const league = await League.create({
            ...req.body,
            banner: req.file?.path || "",
        });

        res.json(league);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err.message });
    }
});

/* ---------- GET LEAGUES ---------- */
app.get("/api/leagues", async (req, res) => {
    const leagues = await League.find().sort({ createdAt: -1 });
    res.json(leagues);
});

/* ---------- REGISTER PLAYER ---------- */
app.post("/api/register", upload.single("photo"), async (req, res) => {
    try {
        console.log("Register Body:", req.body);

        const player = await Player.create({
            ...req.body,
            leagueId: String(req.body.leagueId),
            photo: req.file?.path || "",
        });

        console.log("Player saved:", player.name);

        res.json(player);
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ msg: err.message });
    }
});

/* ---------- GET PLAYERS ---------- */
app.get("/api/players/:leagueId", async (req, res) => {
    try {
        const id = String(req.params.leagueId);

        console.log("Fetching players for:", id);

        const players = await Player.find({ leagueId: id });

        console.log("Players found:", players.length);

        res.json(players);
    } catch (err) {
        console.error("Player Fetch Error:", err);
        res.status(500).json({ msg: err.message });
    }
});

/* ---------- DELETE PLAYER ---------- */
app.delete("/api/players/:id", async (req, res) => {
    try {
        await Player.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch {
        res.status(500).json({ success: false });
    }
});

/* ---------- CREATE TEAM ---------- */
app.post("/api/teams", async (req, res) => {
    const team = await Team.create(req.body);
    res.json(team);
});

/* ---------- GET TEAMS WITH PLAYERS ---------- */
app.get("/api/teams/with-players/:leagueId", async (req, res) => {
    try {
        const teams = await Team.find({
            leagueId: String(req.params.leagueId),
        }).populate("players.playerId");

        res.json(teams);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

/* ---------- ADD PLAYER ---------- */
app.post("/api/teams/add-player", async (req, res) => {
    try {
        const { teamId, playerId, price } = req.body;

        const team = await Team.findById(teamId);
        const player = await Player.findById(playerId);

        if (!team || !player) {
            return res.status(400).json({ msg: "Invalid data" });
        }

        player.status = "sold";
        player.teamId = teamId;
        player.price = price;
        await player.save();

        team.players.push({ playerId, price });
        team.purse -= price;
        await team.save();

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error selling player" });
    }
});

/* ---------- REMOVE PLAYER ---------- */
app.post("/api/teams/remove-player", async (req, res) => {
    try {
        const { playerId, teamId } = req.body;

        const team = await Team.findById(teamId);
        const player = await Player.findById(playerId);

        if (!team || !player) {
            return res.status(400).json({ msg: "Invalid data" });
        }

        player.status = "unsold";
        player.teamId = null;
        player.price = 0;
        await player.save();

        team.players = team.players.filter(
            (p) => p.playerId.toString() !== playerId
        );

        await team.save();

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error removing player" });
    }
});

/* ---------- PAYMENT ---------- */
app.use("/api/payment", paymentRoutes);

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});