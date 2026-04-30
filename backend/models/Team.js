import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        purse: {
            type: Number,
            default: 50000,
            min: 0
        },

        leagueId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "League",
            required: true
        },

        players: [
            {
                playerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Player",
                    required: true
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ]
    },
    { timestamps: true }
);

// ✅ Prevent overwrite error
export default mongoose.models.Team || mongoose.model("Team", teamSchema);