

// // import { useNavigate } from "react-router-dom";
// // import BASE_URL from "../api";
// // import "./LeagueCard.css";

// // function LeagueCard({ league, showRegister }) {
// //     const navigate = useNavigate();

// //     return (
// //         <div className="league-card">

// //             {/* IMAGE */}
// //             <img
// //                 src={
// //                     league.banner
// //                         ? `${BASE_URL}/uploads/${league.banner}`
// //                         : "https://via.placeholder.com/600x200?text=League"
// //                 }
// //                 alt={league.name}
// //                 className="league-img"
// //             />

// //             <div className="league-body">

// //                 {/* TITLE */}
// //                 <h4 className="league-title">{league.name}</h4>

// //                 {/* DETAILS */}
// //                 <p>📍 <b>{league.village}</b></p>
// //                 <p>💰 Fee: ₹<b>{league.entryFee}</b></p>
// //                 <p>📅 {new Date(league.lastDate).toLocaleDateString()}</p>

// //                 {/* ACTION BUTTONS */}
// //                 <div className="league-actions">

// //                     {showRegister && (
// //                         <button
// //                             className="btn-register"
// //                             onClick={() => navigate(`/register/${league._id}`)}
// //                         >
// //                             Register
// //                         </button>
// //                     )}

// //                     {/* <button
// //                         className="btn-auction"
// //                         onClick={() => navigate(`/auction/${league._id}`)}
// //                     >
// //                         Auction
// //                     </button> */}

// //                 </div>

// //             </div>
// //         </div>
// //     );
// // }

// // export default LeagueCard;
// // ==================================================


// import { useNavigate } from "react-router-dom";
// import BASE_URL from "../api";
// import "./LeagueCard.css";

// function LeagueCard({ league, showRegister }) {
//     const navigate = useNavigate();

//     return (
//         <div className="league-card">

//             {/* IMAGE */}
//             <img
//                 src={
//                     league.banner
//                         ? `${BASE_URL}/uploads/${league.banner}`
//                         : "/default.png"
//                 }
//                 alt={league.name}
//                 className="league-img"
//                 onError={(e) => {
//                     e.target.src = "/default.png"; // 🔥 fallback if image fails
//                 }}
//             />

//             <div className="league-body">

//                 {/* TITLE */}
//                 <h4 className="league-title">{league.name}</h4>

//                 {/* DETAILS */}
//                 <p>📍 <b>{league.village}</b></p>
//                 <p>💰 Fee: ₹<b>{league.entryFee || 0}</b></p>

//                 <p>
//                     📅{" "}
//                     {league.lastDate
//                         ? new Date(league.lastDate).toLocaleDateString()
//                         : "No Date"}
//                 </p>

//                 {/* ACTION BUTTONS */}
//                 <div className="league-actions">

//                     {showRegister && (
//                         <button
//                             className="btn-register"
//                             onClick={() => navigate(`/register/${league._id}`)}
//                         >
//                             Register
//                         </button>
//                     )}

//                 </div>

//             </div>
//         </div>
//     );
// }

// export default LeagueCard;

// =====================================

import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";
import "./LeagueCard.css";

function LeagueCard({ league, showRegister }) {
    const navigate = useNavigate();

    // ✅ VITE SAFE IMAGE PATH
    const fallbackImg = new URL("../assets/logo.jpeg", import.meta.url).href;

    const getImage = () => {
        if (league?.banner) {
            return `${BASE_URL}/uploads/${league.banner}`;
        }
        return fallbackImg;
    };

    return (
        <div className="league-card">

            <img
                src={getImage()}
                alt={league?.name || "League"}
                className="league-img"
                onError={(e) => {
                    e.target.src = fallbackImg;
                }}
            />

            <div className="league-body">

                <h4 className="league-title">
                    {league?.name || "League Name"}
                </h4>

                <p>📍 <b>{league?.village || "N/A"}</b></p>

                <p>💰 Fee: ₹<b>{league?.entryFee ?? 0}</b></p>

                <p>
                    📅{" "}
                    {league?.lastDate
                        ? new Date(league.lastDate).toLocaleDateString()
                        : "No Date"}
                </p>

                <div className="league-actions">
                    {showRegister && (
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