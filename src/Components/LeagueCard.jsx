import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";
import "./LeagueCard.css";

function LeagueCard({ league = {}, showRegister }) {

    console.log("Banner:", league.banner);
    const navigate = useNavigate();

    // ✅ FIXED IMAGE HANDLER
    const getImg = (img) => {
        if (!img) return "/default.png";

        // Cloudinary / external image
        if (img.startsWith("http")) return img;

        // Local upload fallback
        return `${BASE_URL}/uploads/${img}`;
    };

    // ✅ Safe date formatting
    const formattedDate = league.lastDate
        ? new Date(league.lastDate).toLocaleDateString()
        : "No Date";

    return (
        <div className="league-card">

            {/* ✅ IMAGE */}
            <img
                src={getImg(league.banner)}
                alt={league.name || "League"}
                className="league-img"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default.png";
                }}
            />

            <div className="league-body">

                {/* TITLE */}
                <h4 className="league-title">
                    {league.name || "League Name"}
                </h4>

                {/* DETAILS */}
                <p>📍 <b>{league.village || "Unknown"}</b></p>

                <p>
                    💰 Fee: ₹<b>{league.entryFee ?? 0}</b>
                </p>

                <p>📅 {formattedDate}</p>

                {/* BUTTON */}
                <div className="league-actions">
                    {showRegister && league._id && (
                        <button
                            className="btn-register"
                            onClick={() => navigate(`/register/${league._id}`)}
                        >
                            Register
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}

export default LeagueCard;