// import { useNavigate } from "react-router-dom";
// import BASE_URL from "../api";

// function LeagueCard({ league, showRegister }) {
//     const navigate = useNavigate();

//     return (
//         <div
//             className="card mb-4 shadow"
//             style={{
//                 borderRadius: "12px",
//                 overflow: "hidden"
//             }}
//         >

//             {/* 🔥 BANNER IMAGE */}
//             <img
//                 src={
//                     league.banner
//                         ? `${BASE_URL}/uploads/${league.banner}`
//                         : "https://via.placeholder.com/600x200?text=League+Banner"
//                 }
//                 alt={league.name}
//                 style={{
//                     width: "100%",
//                     height: "180px",
//                     objectFit: "cover"
//                 }}
//             />

//             <div className="p-3">

//                 {/* TITLE */}
//                 <h4 style={{ fontWeight: "bold" }}>{league.name}</h4>

//                 {/* DETAILS */}
//                 <p>📍 Village: <strong>{league.village}</strong></p>
//                 <p>💰 Fee: ₹<strong>{league.entryFee}</strong></p>
//                 <p>📅 Last Date: <strong>{league.lastDate}</strong></p>

//                 {/* 🔥 REGISTER BUTTON (ONLY IN REGISTER PAGE) */}
//                 {showRegister && (
//                     <button
//                         className="btn btn-warning w-100 mt-2"
//                         onClick={() => navigate(`/register/${league._id}`)}
//                     >
//                         Register Player
//                     </button>
//                 )}

//             </div>
//         </div>
//     );
// }

// export default LeagueCard;


import { useNavigate } from "react-router-dom";
import BASE_URL from "../api";
import "./LeagueCard.css";

function LeagueCard({ league, showRegister }) {
    const navigate = useNavigate();

    return (
        <div className="league-card">

            {/* IMAGE */}
            <img
                src={
                    league.banner
                        ? `${BASE_URL}/uploads/${league.banner}`
                        : "https://via.placeholder.com/600x200?text=League"
                }
                alt={league.name}
                className="league-img"
            />

            <div className="league-body">

                {/* TITLE */}
                <h4 className="league-title">{league.name}</h4>

                {/* DETAILS */}
                <p>📍 <b>{league.village}</b></p>
                <p>💰 Fee: ₹<b>{league.entryFee}</b></p>
                <p>📅 {new Date(league.lastDate).toLocaleDateString()}</p>

                {/* ACTION BUTTONS */}
                <div className="league-actions">

                    {showRegister && (
                        <button
                            className="btn-register"
                            onClick={() => navigate(`/register/${league._id}`)}
                        >
                            Register
                        </button>
                    )}

                    {/* <button
                        className="btn-auction"
                        onClick={() => navigate(`/auction/${league._id}`)}
                    >
                        Auction
                    </button> */}

                </div>

            </div>
        </div>
    );
}

export default LeagueCard;