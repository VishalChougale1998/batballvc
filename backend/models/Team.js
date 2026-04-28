import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    purse: { type: Number, default: 50000 },

    leagueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "League",
        required: true
    },

    players: [
        {
            playerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player"
            },
            price: {
                type: Number,
                required: true
            }
        }
    ]
}, { timestamps: true });

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);