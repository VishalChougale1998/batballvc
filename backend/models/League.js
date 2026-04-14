import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema({
    name: String,
    city: String,
    slug: String,
    photo: String
});

export default mongoose.model("League", leagueSchema);