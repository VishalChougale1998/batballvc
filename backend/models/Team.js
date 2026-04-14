import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    purse: { type: Number, default: 50000 },
    leagueId: { type: mongoose.Schema.Types.ObjectId, ref: "League" },
    players: [{
        playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
        price: { type: Number, required: true }
    }]
});

export default mongoose.model("Team", TeamSchema);
