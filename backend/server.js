import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import paymentRoutes from "./routes/payment.js";

const app = express();

/* ================= ESM FIX ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= MIDDLEWARE ================= */
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://batballvc-1.onrender.com"
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= CREATE UPLOADS FOLDER ================= */
const uploadsPath = path.join(__dirname, "uploads");

/* ================= FILE UPLOAD ================= */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

/* ================= STATIC FILES (FIXED) ================= */
app.use("/uploads", express.static(uploadsPath));

/* ================= DB ================= */
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

/* ================= MODELS ================= */

const League = mongoose.model("League", new mongoose.Schema({
    name: String,
    village: String,
    slug: String,
    banner: String,
    entryFee: { type: Number, default: 0 },
    lastDate: { type: Date, default: null }
}, { timestamps: true }));

const Player = mongoose.model("Player", new mongoose.Schema({
    name: String,
    role: String,
    village: String,
    mobile: String,
    leagueId: String,
    photo: { type: String, default: "" },
    tshirtSize: { type: String, default: "-" },
    pantSize: { type: String, default: "-" },
    status: { type: String, default: "unsold" },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },
    price: { type: Number, default: 0 }
}, { timestamps: true }));

const Team = mongoose.model("Team", new mongoose.Schema({
    name: String,
    purse: Number,
    leagueId: String,
    players: [
        {
            playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
            price: Number,
        },
    ],
}, { timestamps: true }));

/* ================= ROUTES ================= */

app.get("/", (req, res) => res.send("API running..."));

/* ---------- CREATE LEAGUE ---------- */
app.post("/api/create-league", upload.single("banner"), async (req, res) => {
    try {
        const { name, village, slug, entryFee, lastDate } = req.body;

        const league = await League.create({
            name,
            village,
            slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
            entryFee: Number(entryFee) || 0,
            lastDate: lastDate ? new Date(lastDate) : null,
            banner: req.file ? req.file.filename : ""
        });

        res.json(league);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ---------- GET LEAGUES ---------- */
app.get("/api/leagues", async (req, res) => {
    const leagues = await League.find().sort({ createdAt: -1 });
    res.json(leagues);
});

/* ---------- DELETE LEAGUE ---------- */
app.delete("/api/leagues/:id", async (req, res) => {
    try {
        const id = req.params.id;

        await League.findByIdAndDelete(id);
        await Player.deleteMany({ leagueId: id });
        await Team.deleteMany({ leagueId: id });

        res.json({ success: true });
    } catch {
        res.status(500).json({ msg: "Delete failed" });
    }
});

/* ---------- REGISTER PLAYER ---------- */
app.post("/api/register", upload.single("photo"), async (req, res) => {
    try {
        const player = await Player.create({
            ...req.body,
            photo: req.file ? req.file.filename : ""
        });

        res.json(player);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ---------- GET PLAYERS ---------- */
app.get("/api/players/:leagueId", async (req, res) => {
    const players = await Player.find({ leagueId: req.params.leagueId });
    res.json(players);
});

/* ---------- DELETE PLAYER ---------- */
app.delete("/api/players/:id", async (req, res) => {
    try {
        await Player.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch {
        res.status(500).json({ msg: "Delete failed" });
    }
});

/* ---------- CREATE TEAM ---------- */
app.post("/api/teams", async (req, res) => {
    try {
        const team = await Team.create({
            ...req.body,
            purse: Number(req.body.purse) || 50000
        });

        res.json(team);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

/* ---------- GET TEAMS ---------- */
app.get("/api/teams/:leagueId", async (req, res) => {
    const teams = await Team.find({ leagueId: req.params.leagueId });
    res.json(teams);
});

/* ---------- TEAMS WITH PLAYERS ---------- */
app.get("/api/teams/with-players/:leagueId", async (req, res) => {
    try {
        const teams = await Team.find({ leagueId: req.params.leagueId })
            .populate("players.playerId");

        res.json(teams);
    } catch {
        res.status(500).json({ msg: "Error loading teams" });
    }
});

/* ---------- DELETE TEAM ---------- */
app.delete("/api/teams/:id", async (req, res) => {
    try {
        const teamId = req.params.id;

        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ success: false });

        await Player.updateMany(
            { teamId },
            { status: "unsold", teamId: null, price: 0 }
        );

        await Team.findByIdAndDelete(teamId);

        res.json({ success: true });

    } catch {
        res.status(500).json({ success: false });
    }
});

/* ---------- SELL PLAYER ---------- */
app.post("/api/teams/add-player", async (req, res) => {
    try {
        let { teamId, playerId, price } = req.body;
        price = Number(price);

        const team = await Team.findById(teamId);
        const player = await Player.findById(playerId);

        if (!team || !player) return res.status(404).json({ msg: "Not found" });
        if (player.status === "sold") return res.status(400).json({ msg: "Already sold" });
        if (team.purse < price) return res.status(400).json({ msg: "Low purse" });

        player.status = "sold";
        player.teamId = teamId;
        player.price = price;
        await player.save();

        team.players.push({ playerId, price });
        team.purse -= price;
        await team.save();

        res.json({ success: true });

    } catch {
        res.status(500).json({ msg: "Error" });
    }
});

/* ---------- REMOVE PLAYER ---------- */
app.post("/api/teams/remove-player", async (req, res) => {
    try {
        const { playerId, teamId } = req.body;

        const team = await Team.findById(teamId);
        const player = await Player.findById(playerId);

        if (!team || !player) {
            return res.status(404).json({ msg: "Not found" });
        }

        const existing = team.players.find(
            p => p.playerId.toString() === playerId
        );

        team.players = team.players.filter(
            p => p.playerId.toString() !== playerId
        );

        if (existing) {
            team.purse += existing.price;
        }

        await team.save();

        player.status = "unsold";
        player.teamId = null;
        player.price = 0;
        await player.save();

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

app.listen(PORT, () => console.log(`Server running on ${PORT}`));