// import mongoose from "mongoose";

// const playerSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     village: String,
//     role: { type: String, required: true },
//     photo: String,

//     leagueId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "League",
//         required: true
//     },

//     status: {
//         type: String,
//         enum: ["unsold", "sold"],
//         default: "unsold"
//     },

//     price: {
//         type: Number,
//         default: 0
//     },

//     teamId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Team",
//         default: null
//     }
// }, { timestamps: true });

// export default mongoose.models.Player || mongoose.model("Player", playerSchema);

import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    village: {
        type: String,
        default: "",
    },

    role: {
        type: String,
        required: true,
    },

    // ✅ IMPORTANT FIX
    mobile: {
        type: String,
        default: "",
    },

    // ✅ IMPORTANT FIX
    tshirtSize: {
        type: String,
        default: "",
    },

    // ✅ IMPORTANT FIX
    pantSize: {
        type: String,
        default: "",
    },

    photo: {
        type: String,
        default: "",
    },

    // ✅ KEEP STRING (BEST FOR YOUR APP)
    leagueId: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ["unsold", "sold"],
        default: "unsold",
    },

    price: {
        type: Number,
        default: 0,
    },

    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null,
    },

}, { timestamps: true });

export default mongoose.models.Player ||
    mongoose.model("Player", playerSchema);