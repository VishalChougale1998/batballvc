import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema(
    {
        name: String,
        village: String,
        slug: String,
        banner: String,
        entryFee: Number,
        lastDate: Date,
    },
    { timestamps: true }
);

export default mongoose.models.League || mongoose.model("League", leagueSchema);