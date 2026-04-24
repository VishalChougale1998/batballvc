

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

function LeagueCard({ league = {}, showRegister }) {
    const navigate = useNavigate();

    // ✅ Safe image URL
    const imageUrl = league.banner
        ? `${BASE_URL}/uploads/${league.banner}`
        : "/default.jpg";

    // ✅ Safe date formatting
    const formattedDate = league.lastDate
        ? new Date(league.lastDate).toLocaleDateString()
        : "No Date";

    return (
        <div className="league-card">

            {/* ✅ IMAGE */}
            <img
                src={imageUrl}
                alt={league.name || "League"}
                className="league-img"
                onError={(e) => {
                    e.target.onerror = null; // prevent infinite loop
                    e.target.src = "/default.jpg";
                }}
            />

            <div className="league-body">

                {/* ✅ TITLE */}
                <h4 className="league-title">
                    {league.name || "League Name"}
                </h4>

                {/* ✅ DETAILS */}
                <p>📍 <b>{league.village || "Unknown"}</b></p>

                <p>
                    💰 Fee: ₹<b>{league.entryFee ?? 0}</b>
                </p>

                <p>📅 {formattedDate}</p>

                {/* ✅ BUTTON */}
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