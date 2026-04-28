import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    village: String,
    role: { type: String, required: true },
    photo: String,

    leagueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "League",
        required: true
    },

    status: {
        type: String,
        enum: ["unsold", "sold"],
        default: "unsold"
    },

    price: {
        type: Number,
        default: 0
    },

    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    }
}, { timestamps: true });

export default mongoose.models.Player || mongoose.model("Player", playerSchema);