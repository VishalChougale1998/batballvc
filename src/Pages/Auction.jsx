// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import BASE_URL from "../api";
// import "./Auction.css";

// import jsPDF from "jspdf";
// import * as XLSX from "xlsx";

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

//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         loadData();
//     }, [leagueId]);

//     /* ================= LOAD ================= */
//     const loadData = async () => {
//         try {
//             setLoading(true);

//             const p = await fetch(`${BASE_URL}/api/players/${leagueId}`);
//             const t = await fetch(`${BASE_URL}/api/teams/with-players/${leagueId}`);

//             const playersData = await p.json();
//             const teamsData = await t.json();

//             setPlayers(Array.isArray(playersData) ? playersData : []);
//             setTeams(Array.isArray(teamsData) ? teamsData : []);

//         } catch (err) {
//             console.error(err);
//             setPlayers([]);
//             setTeams([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= IMAGE FIX ================= */
//     const getImg = (photo) => {
//         if (!photo) return "/default.jpg";

//         if (photo.startsWith("http")) return photo;

//         const clean = photo.replace(/^\/?uploads\//, "");

//         return `${BASE_URL}/uploads/${clean}`;
//     };

//     /* ================= TEAM ================= */
//     const createTeam = async () => {
//         if (!teamName) return alert("Enter team name");

//         await fetch(`${BASE_URL}/api/teams`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ name: teamName, purse: teamPurse, leagueId })
//         });

//         setTeamName("");
//         loadData();
//     };

//     const deleteTeam = async (id) => {
//         if (!window.confirm("Delete this team?")) return;

//         await fetch(`${BASE_URL}/api/teams/${id}`, { method: "DELETE" });
//         loadData();

//         if (selectedTeam?._id === id) setSelectedTeam(null);
//     };

//     /* ================= PLAYER ================= */
//     const sellPlayer = async () => {
//         if (!teamId || !currentPlayer) return alert("Select team & player");

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
//         loadData();
//     };

//     const unsoldPlayer = async (playerId, teamId) => {
//         await fetch(`${BASE_URL}/api/teams/remove-player`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ playerId, teamId })
//         });

//         loadData();
//     };

//     /* ================= PDF ================= */
//     const downloadPDF = async () => {
//         if (!selectedTeam) return alert("Select team first");

//         const pdf = new jsPDF();

//         const getBase64 = async (url) => {
//             try {
//                 const res = await fetch(url);
//                 const blob = await res.blob();

//                 return await new Promise((resolve) => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => resolve(reader.result);
//                     reader.readAsDataURL(blob);
//                 });
//             } catch {
//                 return null;
//             }
//         };

//         const formatPrice = (val) => {
//             const num = Number(val);
//             if (isNaN(num)) return "Rs 0";
//             return `Rs ${num.toLocaleString("en-IN")}`;
//         };

//         pdf.setFontSize(18);
//         pdf.text(selectedTeam.name, 105, 15, { align: "center" });

//         let x = 10, y = 30;

//         for (let p of selectedTeam.players || []) {
//             const player = p.playerId;
//             if (!player) continue;

//             pdf.rect(x, y, 90, 55);

//             const img = await getBase64(getImg(player.photo));
//             if (img) {
//                 const format = img.includes("png") ? "PNG" : "JPEG";
//                 pdf.addImage(img, format, x + 3, y + 5, 20, 20);
//             }

//             pdf.text(player.name || "-", x + 28, y + 10);
//             pdf.text(player.role || "-", x + 28, y + 16);
//             pdf.text(player.village || "-", x + 28, y + 22);

//             pdf.text(`Shirt: ${player.tshirtSize || "-"}`, x + 5, y + 35);
//             pdf.text(`Pant: ${player.pantSize || "-"}`, x + 45, y + 35);

//             pdf.text(formatPrice(p.price), x + 5, y + 45);

//             x += 100;
//             if (x > 180) {
//                 x = 10;
//                 y += 60;
//             }

//             if (y > 260) {
//                 pdf.addPage();
//                 x = 10;
//                 y = 20;
//             }
//         }

//         pdf.save(`${selectedTeam.name}.pdf`);
//     };

//     /* ================= EXCEL ================= */
//     const downloadExcel = () => {
//         if (!selectedTeam) return alert("Select team first");

//         const data = (selectedTeam.players || []).map(p => ({
//             Name: p.playerId?.name,
//             Role: p.playerId?.role,
//             Village: p.playerId?.village,
//             Price: p.price
//         }));

//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();

//         XLSX.utils.book_append_sheet(wb, ws, "Team");
//         XLSX.writeFile(wb, `${selectedTeam.name}.xlsx`);
//     };

//     return (
//         <div className="auction-page">

//             <div className="top-bar">
//                 <input value={teamName} onChange={(e) => setTeamName(e.target.value)} />
//                 <input type="number" value={teamPurse} onChange={(e) => setTeamPurse(e.target.value)} />
//                 <button onClick={createTeam}>Create</button>
//             </div>

//             <div className="team-bar">
//                 {teams.map(t => (
//                     <div key={t._id}
//                         className={`team-pill ${selectedTeam?._id === t._id ? "active" : ""}`}
//                         onClick={() => {
//                             setSelectedTeam(t);
//                             setCurrentPlayer(null);
//                         }}>
//                         {t.name} Rs {t.purse}
//                         <span onClick={(e) => {
//                             e.stopPropagation();
//                             deleteTeam(t._id);
//                         }}>❌</span>
//                     </div>
//                 ))}
//             </div>

//             <div className="main-layout">

//                 <div className="left-panel">
//                     <h3>Unsold Players</h3>

//                     {loading && <p>Loading...</p>}

//                     {players.filter(p => p.status !== "sold").map(p => (
//                         <div key={p._id} className="player-row"
//                             onClick={() => {
//                                 setCurrentPlayer(p);
//                                 setSelectedTeam(null);
//                             }}>
//                             <img
//                                 src={getImg(p.photo)}
//                                 onError={(e) => (e.target.src = "/default.jpg")}
//                                 alt=""
//                             />
//                             <div>{p.name}</div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="right-panel">

//                     {selectedTeam && (
//                         <>
//                             <button onClick={downloadPDF}>PDF</button>
//                             <button onClick={downloadExcel}>Excel</button>

//                             <div className="team-grid">
//                                 {selectedTeam.players?.map(p => (
//                                     <div className="team-card" key={p._id}>
//                                         <img
//                                             src={getImg(p.playerId?.photo)}
//                                             onError={(e) => (e.target.src = "/default.jpg")}
//                                             alt=""
//                                         />
//                                         <h3>{p.playerId?.name || "-"}</h3>
//                                         <p>{p.playerId?.role || "-"}</p>
//                                         <p>Rs {Number(p.price || 0).toLocaleString("en-IN")}</p>

//                                         <button onClick={() =>
//                                             unsoldPlayer(p.playerId?._id, selectedTeam?._id)
//                                         }>
//                                             Remove
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         </>
//                     )}

//                     {!selectedTeam && currentPlayer && (
//                         <div className="auction-card">

//                             <div className="card-left">
//                                 <img
//                                     src={getImg(currentPlayer.photo)}
//                                     onError={(e) => (e.target.src = "/default.jpg")}
//                                     alt=""
//                                 />
//                             </div>

//                             <div className="card-right">

//                                 <h2>{currentPlayer.name}</h2>
//                                 <p>{currentPlayer.role}</p>

//                                 <h1>Rs {price}</h1>

//                                 <div className="bid-buttons">
//                                     <button onClick={() => setPrice(price + 100)}>+100</button>
//                                     <button onClick={() => setPrice(price + 500)}>+500</button>
//                                     <button onClick={() => setPrice(price + 1000)}>+1000</button>
//                                 </div>

//                                 <select onChange={(e) => setTeamId(e.target.value)}>
//                                     <option>Select Team</option>
//                                     {teams.map(t => (
//                                         <option key={t._id} value={t._id}>{t.name}</option>
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



// =============================


import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "../api";
import "./Auction.css";

import jsPDF from "jspdf";
import * as XLSX from "xlsx";

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

    const [loading, setLoading] = useState(false);

    // ================= LOAD =================
    useEffect(() => {
        if (!leagueId) {
            console.error("❌ leagueId missing");
            return;
        }

        loadData();
    }, [leagueId]);

    const loadData = async () => {
        try {
            setLoading(true);

            console.log("Fetching players for:", leagueId);

            const pRes = await fetch(`${BASE_URL}/api/players/${leagueId}`);
            const tRes = await fetch(`${BASE_URL}/api/teams/with-players/${leagueId}`);

            if (!pRes.ok || !tRes.ok) {
                throw new Error("API failed");
            }

            const playersData = await pRes.json();
            const teamsData = await tRes.json();

            console.log("Players:", playersData);
            console.log("Teams:", teamsData);

            setPlayers(Array.isArray(playersData) ? playersData : []);
            setTeams(Array.isArray(teamsData) ? teamsData : []);

        } catch (err) {
            console.error("❌ Load Error:", err);
            setPlayers([]);
            setTeams([]);
        } finally {
            setLoading(false);
        }
    };

    // ================= IMAGE FIX =================
    const getImg = (photo) => {
        if (!photo) return "/default.png";

        if (photo.startsWith("http")) return photo;

        return `${BASE_URL}/uploads/${photo}`;
    };

    // ================= TEAM =================
    const createTeam = async () => {
        if (!teamName) return alert("Enter team name");

        await fetch(`${BASE_URL}/api/teams`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: teamName, purse: teamPurse, leagueId })
        });

        setTeamName("");
        loadData();
    };

    const deleteTeam = async (id) => {
        if (!window.confirm("Delete this team?")) return;

        await fetch(`${BASE_URL}/api/teams/${id}`, { method: "DELETE" });
        loadData();

        if (selectedTeam?._id === id) setSelectedTeam(null);
    };

    // ================= PLAYER =================
    const sellPlayer = async () => {
        if (!teamId || !currentPlayer) return alert("Select team & player");

        await fetch(`${BASE_URL}/api/teams/add-player`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                teamId,
                playerId: currentPlayer._id,
                price
            })
        });

        setCurrentPlayer(null);
        setPrice(0);
        loadData();
    };

    const unsoldPlayer = async (playerId, teamId) => {
        await fetch(`${BASE_URL}/api/teams/remove-player`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerId, teamId })
        });

        loadData();
    };
    // ===================== pdf ===========
    const exportPDF = async () => {
        if (!selectedTeam) return alert("Select a team first");

        const doc = new jsPDF();
        let y = 10;

        doc.setFontSize(16);
        doc.text(`Team: ${selectedTeam.name}`, 10, y);
        y += 10;

        for (const p of selectedTeam.players) {
            const player = p.playerId;
            if (!player) continue;

            // ✅ CONVERT IMAGE TO BASE64
            let imgData = null;

            try {
                const response = await fetch(player.photo);
                const blob = await response.blob();

                imgData = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            } catch (err) {
                console.log("Image load failed");
            }

            // ✅ ADD IMAGE (if exists)
            if (imgData) {
                doc.addImage(imgData, "JPEG", 10, y, 30, 30);
            }

            // TEXT
            doc.setFontSize(10);

            doc.text(`Name: ${player.name}`, 45, y + 5);
            doc.text(`Village: ${player.village}`, 45, y + 10);
            doc.text(`Mobile: ${player.mobile}`, 45, y + 15);
            doc.text(`Role: ${player.role}`, 45, y + 20);
            doc.text(`Shirt: ${player.tshirtSize}`, 45, y + 25);
            doc.text(`Pant: ${player.pantSize}`, 45, y + 30);
            doc.text(`Bid: Rs. ${p.price}`, 45, y + 35);

            y += 45;

            if (y > 260) {
                doc.addPage();
                y = 10;
            }
        }

        doc.save(`${selectedTeam.name}_Players.pdf`);
    };
    // ================================

    // ================= UI =================
    return (
        <div className="auction-page">

            <h2>🏏 Auction</h2>

            {/* CREATE TEAM */}
            <div className="top-bar">
                <input placeholder="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />

                <input type="number"
                    value={teamPurse}
                    onChange={(e) => setTeamPurse(e.target.value)}
                />

                <button onClick={createTeam}>Create</button>
            </div>

            {/* TEAM BAR */}
            <div className="team-bar">
                {teams.map(t => (
                    <div key={t._id}
                        className={`team-pill ${selectedTeam?._id === t._id ? "active" : ""}`}
                        onClick={() => {
                            setSelectedTeam(t);
                            setCurrentPlayer(null);
                        }}>
                        {t.name} ₹{t.purse}

                        <span onClick={(e) => {
                            e.stopPropagation();
                            deleteTeam(t._id);
                        }}>❌</span>
                    </div>
                ))}
            </div>

            <div className="main-layout">

                {/* LEFT SIDE */}
                <div className="left-panel">
                    <h3>Unsold Players</h3>

                    {loading && <p>Loading...</p>}

                    {!loading && players.length === 0 && (
                        <p>No players found ❌</p>
                    )}

                    {players
                        .filter(p => p.status !== "sold")
                        .map(p => (
                            <div key={p._id}
                                className="player-row"
                                onClick={() => {
                                    setCurrentPlayer(p);
                                    setSelectedTeam(null);
                                }}>

                                <img
                                    src={getImg(p.photo)}
                                    onError={(e) => (e.target.src = "/default.png")}
                                    alt=""
                                />

                                <div>{p.name}</div>
                            </div>
                        ))}
                </div>

                {/* RIGHT SIDE */}
                <div className="right-panel">

                    {selectedTeam && (
                        <div style={{ width: "100%" }}>

                            {/* 🔥 HEADER (TEAM NAME + EXPORT BUTTON) */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "10px"
                            }}>
                                <h3>{selectedTeam.name} Players</h3>

                                <button onClick={exportPDF} className="create-btn">
                                    Export PDF
                                </button>
                            </div>

                            {/* TEAM GRID */}
                            <div className="team-grid">
                                {selectedTeam.players?.map(p => (

                                    <div className="team-card" key={p._id}>
                                        <img
                                            src={getImg(p.playerId?.photo)}
                                            onError={(e) => (e.target.src = "/default.png")}
                                            alt=""
                                        />

                                        <h3>{p.playerId?.name || "-"}</h3>
                                        <p>{p.playerId?.role || "-"}</p>
                                        <p>₹{Number(p.price || 0).toLocaleString()}</p>

                                        <button onClick={() =>
                                            unsoldPlayer(p.playerId?._id, selectedTeam?._id)
                                        }>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!selectedTeam && currentPlayer && (
                        <div className="auction-card">

                            {/* LEFT IMAGE */}
                            <div className="card-left">
                                <img
                                    src={getImg(currentPlayer.photo)}
                                    onError={(e) => (e.target.src = "/default.png")}
                                    alt="player"
                                />
                            </div>

                            {/* RIGHT CONTENT */}
                            <div className="card-right">

                                <h2>{currentPlayer.name}</h2>
                                <p>{currentPlayer.role}</p>

                                <h1>₹{price}</h1>

                                <div className="bid-buttons">
                                    <button onClick={() => setPrice(price + 100)}>+100</button>
                                    <button onClick={() => setPrice(price + 500)}>+500</button>
                                    <button onClick={() => setPrice(price + 1000)}>+1000</button>
                                </div>

                                <select onChange={(e) => setTeamId(e.target.value)}>
                                    <option value="">Select Team</option>
                                    {teams.map(t => (
                                        <option key={t._id} value={t._id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>

                                <button className="sell-btn" onClick={sellPlayer}>
                                    SELL
                                </button>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Auction;