import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";   // ✅ IMPORTANT
import paymentRoutes from "./routes/payment.js";

const app = express();

/* ================= ESM FIX (__dirname) ================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================= MIDDLEWARE ================= */

app.use(cors({ origin: "*" }));
app.use(express.json());

/* ================= FILE UPLOAD ================= */

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

/* ✅ FIXED STATIC PATH */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= DB ================= */

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

/* ================= MODELS ================= */

const League = mongoose.model("League", new mongoose.Schema({
    name: String,
    village: String,
    playerLimit: Number,
    entryFee: Number,
    lastDate: String,
    slug: String,
    banner: String,
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

/* ---------- LEAGUE ---------- */

app.post("/api/create-league", upload.single("banner"), async (req, res) => {
    try {
        const { name, village, playerLimit, entryFee, lastDate, slug } = req.body;

        const league = await League.create({
            name,
            village,
            playerLimit,
            entryFee,
            lastDate,
            slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
            banner: req.file ? req.file.filename : "",
        });

        res.json(league);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/leagues", async (req, res) => {
    const leagues = await League.find().sort({ createdAt: -1 });
    res.json(leagues);
});

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

/* ---------- PLAYER ---------- */

app.post("/api/register", upload.single("photo"), async (req, res) => {
    try {
        const player = await Player.create({
            ...req.body,
            photo: req.file ? req.file.filename : "",
        });

        res.json(player);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/players/:leagueId", async (req, res) => {
    const players = await Player.find({ leagueId: req.params.leagueId });
    res.json(players);
});

app.delete("/api/players/:id", async (req, res) => {
    try {
        await Player.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch {
        res.status(500).json({ msg: "Delete failed" });
    }
});

/* ---------- TEAM ---------- */

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

app.get("/api/teams/:leagueId", async (req, res) => {
    try {
        const teams = await Team.find({ leagueId: req.params.leagueId });
        res.json(teams);
    } catch {
        res.status(500).json({ msg: "Server error" });
    }
});

app.get("/api/teams/with-players/:leagueId", async (req, res) => {
    const teams = await Team.find({ leagueId: req.params.leagueId })
        .populate("players.playerId");

    res.json(teams);
});

/* ---------- SELL ---------- */

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
// ========================delete team===============
/* ---------- DELETE TEAM (ADD THIS) ---------- */

app.delete("/api/teams/:id", async (req, res) => {
    try {
        const teamId = req.params.id;

        const team = await Team.findById(teamId);

        if (!team) {
            return res.status(404).json({ msg: "Team not found" });
        }

        // 🔥 Reset players of this team
        await Player.updateMany(
            { teamId: teamId },
            {
                status: "unsold",
                teamId: null,
                price: 0
            }
        );

        // 🔥 Delete team
        await Team.findByIdAndDelete(teamId);

        res.json({ msg: "Team deleted successfully" });

    } catch (err) {
        res.status(500).json({ msg: "Delete failed" });
    }
});

/* ---------- UNSOLD (FIXED SAFE) ---------- */

app.post("/api/teams/remove-player", async (req, res) => {
    try {
        const { teamId, playerId } = req.body;

        const team = await Team.findById(teamId);
        const player = await Player.findById(playerId);

        if (!team || !player) {
            return res.status(404).json({ msg: "Not found" });
        }

        const entry = team.players.find(p => p.playerId.toString() === playerId);

        if (!entry) {
            return res.status(400).json({ msg: "Player not in team" });
        }

        team.purse += entry.price;
        team.players = team.players.filter(p => p.playerId.toString() !== playerId);

        await team.save();

        player.status = "unsold";
        player.teamId = null;
        player.price = 0;
        await player.save();

        res.json({ success: true });

    } catch {
        res.status(500).json({ msg: "Error" });
    }
});

/* ---------- PAYMENT ---------- */

app.use("/api/payment", paymentRoutes);

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));