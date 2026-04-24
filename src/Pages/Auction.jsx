// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import BASE_URL from "../api";
// import "./Auction.css";

// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// function Auction() {
//     const { leagueId } = useParams();

//     const [players, setPlayers] = useState([]);
//     const [teams, setTeams] = useState([]);
//     const [selectedTeam, setSelectedTeam] = useState(null);
//     const [currentPlayer, setCurrentPlayer] = useState(null);

//     const [teamName, setTeamName] = useState("");
//     const [teamPurse, setTeamPurse] = useState(100000);

//     const [teamId, setTeamId] = useState("");
//     const [price, setPrice] = useState(0);
//     const [customBid, setCustomBid] = useState("");

//     useEffect(() => {
//         loadData();
//     }, [leagueId]);

//     const loadData = async () => {
//         try {
//             const p = await fetch(`${BASE_URL}/api/players/${leagueId}`);
//             const t = await fetch(`${BASE_URL}/api/teams/with-players/${leagueId}`);

//             setPlayers(await p.json());
//             setTeams(await t.json());
//         } catch (err) {
//             console.error("Error loading data", err);
//         }
//     };

//     /* 🔥 IMAGE FIX (VERY IMPORTANT) */
//     const getImg = (photo) => {
//         if (!photo) return "https://via.placeholder.com/150";
//         return `${BASE_URL}/uploads/${photo}`;
//     };

//     // ================= CREATE TEAM =================
//     const createTeam = async () => {
//         if (!teamName) return;

//         await fetch(`${BASE_URL}/api/teams`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 name: teamName,
//                 purse: teamPurse,
//                 leagueId
//             })
//         });

//         setTeamName("");
//         loadData();
//     };

//     // ================= DELETE TEAM (FIXED) =================
//     const deleteTeam = async (id) => {
//         await fetch(`${BASE_URL}/api/teams/${id}`, { method: "DELETE" });

//         // 🔥 reload from DB (important)
//         loadData();

//         if (selectedTeam?._id === id) setSelectedTeam(null);
//     };

//     // ================= SELL PLAYER =================
//     const sellPlayer = async () => {
//         if (!teamId) return alert("Select team");

//         await fetch(`${BASE_URL}/api/teams/add-player`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 teamId,
//                 playerId: currentPlayer._id,
//                 price
//             })
//         });

//         setCurrentPlayer(null);
//         setPrice(0);
//         setCustomBid("");
//         loadData();
//     };

//     // ================= UNSOLD PLAYER =================
//     const unsoldPlayer = async (playerId, teamId) => {
//         try {
//             await fetch(`${BASE_URL}/api/teams/remove-player`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ playerId, teamId })
//             });

//             loadData();
//         } catch {
//             alert("Error ❌");
//         }
//     };

//     // ================= EXPORT EXCEL =================
//     const exportExcel = () => {
//         if (!selectedTeam) return;

//         const data = selectedTeam.players.map(p => ({
//             Name: p.playerId?.name,
//             Role: p.playerId?.role,
//             Village: p.playerId?.village,
//             Mobile: p.playerId?.mobile,
//             Shirt: p.playerId?.tshirtSize,
//             Pant: p.playerId?.pantSize,
//             Bid: p.price
//         }));

//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Players");

//         const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//         saveAs(new Blob([buf]), `${selectedTeam.name}.xlsx`);
//     };

//     // ================= EXPORT PDF =================
//     const exportPDF = async () => {
//         const element = document.getElementById("pdf-content");

//         const canvas = await html2canvas(element, { scale: 2 });
//         const imgData = canvas.toDataURL("image/png");

//         const pdf = new jsPDF();
//         pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
//         pdf.save(`${selectedTeam.name}.pdf`);
//     };

//     return (
//         <div className="auction-page">

//             {/* CREATE TEAM */}
//             <div className="top-bar">
//                 <input
//                     placeholder="Team Name"
//                     value={teamName}
//                     onChange={(e) => setTeamName(e.target.value)}
//                 />
//                 <input
//                     type="number"
//                     value={teamPurse}
//                     onChange={(e) => setTeamPurse(e.target.value)}
//                 />
//                 <button className="create-btn" onClick={createTeam}>Create</button>
//             </div>

//             {/* TEAM TABS */}
//             <div className="team-bar">
//                 {teams.map(t => (
//                     <div
//                         key={t._id}
//                         className={`team-pill ${selectedTeam?._id === t._id ? "active" : ""}`}
//                         onClick={() => {
//                             setSelectedTeam(t);
//                             setCurrentPlayer(null);
//                         }}
//                     >
//                         {t.name} ₹{t.purse}

//                         <span
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                                 deleteTeam(t._id);
//                             }}
//                         >
//                             ❌
//                         </span>
//                     </div>
//                 ))}
//             </div>

//             {/* MAIN */}
//             <div className="main-layout">

//                 {/* LEFT PANEL */}
//                 <div className="left-panel">
//                     <h3>Unsold Players</h3>

//                     {players.filter(p => p.status !== "sold").map(p => (
//                         <div
//                             key={p._id}
//                             className="player-row"
//                             onClick={() => {
//                                 setCurrentPlayer(p);
//                                 setSelectedTeam(null);
//                             }}
//                         >
//                             <img
//                                 src={getImg(p.photo)}
//                                 onError={(e) => e.target.src = "https://via.placeholder.com/150"}
//                                 alt=""
//                             />
//                             <div>{p.name}</div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* RIGHT PANEL */}
//                 <div className="right-panel">

//                     {selectedTeam ? (
//                         <div id="pdf-content">

//                             <h2>{selectedTeam.name} Players</h2>

//                             <button onClick={exportExcel}>Excel</button>
//                             <button onClick={exportPDF}>PDF</button>

//                             <div className="team-grid">
//                                 {selectedTeam.players?.map(p => (
//                                     <div className="team-card" key={p._id}>

//                                         <img
//                                             src={getImg(p.playerId?.photo)}
//                                             onError={(e) => e.target.src = "https://via.placeholder.com/150"}
//                                             alt=""
//                                         />

//                                         <h3>{p.playerId?.name}</h3>
//                                         <p>Village: {p.playerId?.village}</p>
//                                         <p>Role: {p.playerId?.role}</p>
//                                         <p>Mobile: {p.playerId?.mobile}</p>
//                                         <p>Shirt: {p.playerId?.tshirtSize}</p>
//                                         <p>Pant: {p.playerId?.pantSize}</p>
//                                         <p><b>₹{p.price}</b></p>

//                                         <button
//                                             className="unsold-btn"
//                                             onClick={() =>
//                                                 unsoldPlayer(
//                                                     p.playerId?._id,
//                                                     selectedTeam?._id
//                                                 )
//                                             }
//                                         >
//                                             ❌ Unsold
//                                         </button>

//                                     </div>
//                                 ))}
//                             </div>

//                         </div>

//                     ) : currentPlayer && (

//                         <div className="auction-card">

//                             <div className="card-left">
//                                 <img
//                                     src={getImg(currentPlayer.photo)}
//                                     onError={(e) => e.target.src = "https://via.placeholder.com/150"}
//                                     alt=""
//                                 />
//                             </div>

//                             <div className="card-right">

//                                 <h2>{currentPlayer.name}</h2>
//                                 <p>{currentPlayer.role}</p>

//                                 <h1>₹{price}</h1>

//                                 <div className="bid-buttons">
//                                     <button onClick={() => setPrice(price + 100)}>+100</button>
//                                     <button onClick={() => setPrice(price + 200)}>+200</button>
//                                     <button onClick={() => setPrice(price + 500)}>+500</button>
//                                     <button onClick={() => setPrice(price + 1000)}>+1000</button>
//                                 </div>

//                                 <input
//                                     placeholder="Enter total bid"
//                                     value={customBid}
//                                     onChange={(e) => {
//                                         setCustomBid(e.target.value);
//                                         setPrice(Number(e.target.value));
//                                     }}
//                                 />

//                                 <select onChange={(e) => setTeamId(e.target.value)}>
//                                     <option>Select Team</option>
//                                     {teams.map(t => (
//                                         <option key={t._id} value={t._id}>
//                                             {t.name}
//                                         </option>
//                                     ))}
//                                 </select>

//                                 <button className="sell-btn" onClick={sellPlayer}>
//                                     SELL PLAYER
//                                 </button>

//                             </div>
//                         </div>
//                     )}

//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Auction;

// ==================================

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "../api";
import "./Auction.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Auction() {
    const { leagueId } = useParams();

    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    const [teamName, setTeamName] = useState("");
    const [teamPurse, setTeamPurse] = useState(100000);

    const [teamId, setTeamId] = useState("");
    const [price, setPrice] = useState(0);
    const [customBid, setCustomBid] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [leagueId]);

    /* ================= LOAD DATA ================= */
    const loadData = async () => {
        try {
            setLoading(true);

            const p = await fetch(`${BASE_URL}/api/players/${leagueId}`);
            const t = await fetch(`${BASE_URL}/api/teams/with-players/${leagueId}`);

            const playersData = await p.json();
            const teamsData = await t.json();

            setPlayers(Array.isArray(playersData) ? playersData : []);
            setTeams(Array.isArray(teamsData) ? teamsData : []);

        } catch (err) {
            console.error("Error loading data", err);
        } finally {
            setLoading(false);
        }
    };

    /* ================= IMAGE FIX ================= */
    const getImg = (photo) => {
        if (!photo) return "/default.jpg";
        return `${BASE_URL}/uploads/${photo}`;
    };

    /* ================= CREATE TEAM ================= */
    const createTeam = async () => {
        if (!teamName) return alert("Enter team name");

        try {
            const res = await fetch(`${BASE_URL}/api/teams`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: teamName,
                    purse: teamPurse,
                    leagueId
                })
            });

            if (!res.ok) throw new Error("Create failed");

            setTeamName("");
            loadData();
        } catch (err) {
            alert("Error creating team ❌");
        }
    };

    /* ================= DELETE TEAM ================= */
    const deleteTeam = async (id) => {
        if (!window.confirm("Delete this team?")) return;

        try {
            const res = await fetch(`${BASE_URL}/api/teams/${id}`, {
                method: "DELETE"
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error("Delete failed");
            }

            loadData();

            if (selectedTeam?._id === id) {
                setSelectedTeam(null);
            }

        } catch (err) {
            alert("Delete failed ❌");
        }
    };

    /* ================= SELL PLAYER ================= */
    const sellPlayer = async () => {
        if (!teamId) return alert("Select team");

        try {
            const res = await fetch(`${BASE_URL}/api/teams/add-player`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamId,
                    playerId: currentPlayer._id,
                    price
                })
            });

            if (!res.ok) throw new Error();

            setCurrentPlayer(null);
            setPrice(0);
            setCustomBid("");
            loadData();

        } catch {
            alert("Sell failed ❌");
        }
    };

    /* ================= UNSOLD PLAYER ================= */
    const unsoldPlayer = async (playerId, teamId) => {
        try {
            const res = await fetch(`${BASE_URL}/api/teams/remove-player`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playerId, teamId })
            });

            if (!res.ok) throw new Error();

            loadData();
        } catch {
            alert("Error ❌");
        }
    };

    return (
        <div className="auction-page">

            {/* CREATE TEAM */}
            <div className="top-bar">
                <input
                    placeholder="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                <input
                    type="number"
                    value={teamPurse}
                    onChange={(e) => setTeamPurse(e.target.value)}
                />
                <button className="create-btn" onClick={createTeam}>Create</button>
            </div>

            {/* TEAM LIST */}
            <div className="team-bar">
                {teams.map(t => (
                    <div
                        key={t._id}
                        className={`team-pill ${selectedTeam?._id === t._id ? "active" : ""}`}
                        onClick={() => {
                            setSelectedTeam(t);
                            setCurrentPlayer(null);
                        }}
                    >
                        {t.name} ₹{t.purse}

                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteTeam(t._id);
                            }}
                        >
                            ❌
                        </span>
                    </div>
                ))}
            </div>

            {/* LEFT PANEL */}
            <div className="left-panel">
                <h3>Unsold Players</h3>

                {loading && <p>Loading...</p>}

                {players.filter(p => p.status !== "sold").map(p => (
                    <div
                        key={p._id}
                        className="player-row"
                        onClick={() => {
                            setCurrentPlayer(p);
                            setSelectedTeam(null);
                        }}
                    >
                        <img
                            src={getImg(p.photo)}
                            onError={(e) => e.target.src = "/default.jpg"}
                            alt=""
                        />
                        <div>{p.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Auction;