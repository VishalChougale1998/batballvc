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

//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         loadData();
//     }, [leagueId]);

//     /* ================= LOAD DATA ================= */
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
//             console.error("Error loading data", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= IMAGE FIX ================= */
//     const getImg = (photo) => {
//         if (!photo) return "/default.jpg";
//         return `${BASE_URL}/uploads/${photo}`;
//     };

//     /* ================= CREATE TEAM ================= */
//     const createTeam = async () => {
//         if (!teamName) return alert("Enter team name");

//         try {
//             const res = await fetch(`${BASE_URL}/api/teams`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     name: teamName,
//                     purse: teamPurse,
//                     leagueId
//                 })
//             });

//             if (!res.ok) throw new Error("Create failed");

//             setTeamName("");
//             loadData();
//         } catch (err) {
//             alert("Error creating team ❌");
//         }
//     };

//     /* ================= DELETE TEAM ================= */
//     const deleteTeam = async (id) => {
//         if (!window.confirm("Delete this team?")) return;

//         try {
//             const res = await fetch(`${BASE_URL}/api/teams/${id}`, {
//                 method: "DELETE"
//             });

//             const data = await res.json();

//             if (!res.ok || !data.success) {
//                 throw new Error("Delete failed");
//             }

//             loadData();

//             if (selectedTeam?._id === id) {
//                 setSelectedTeam(null);
//             }

//         } catch (err) {
//             alert("Delete failed ❌");
//         }
//     };

//     /* ================= SELL PLAYER ================= */
//     const sellPlayer = async () => {
//         if (!teamId) return alert("Select team");

//         try {
//             const res = await fetch(`${BASE_URL}/api/teams/add-player`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     teamId,
//                     playerId: currentPlayer._id,
//                     price
//                 })
//             });

//             if (!res.ok) throw new Error();

//             setCurrentPlayer(null);
//             setPrice(0);
//             setCustomBid("");
//             loadData();

//         } catch {
//             alert("Sell failed ❌");
//         }
//     };

//     /* ================= UNSOLD PLAYER ================= */
//     const unsoldPlayer = async (playerId, teamId) => {
//         try {
//             const res = await fetch(`${BASE_URL}/api/teams/remove-player`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ playerId, teamId })
//             });

//             if (!res.ok) throw new Error();

//             loadData();
//         } catch {
//             alert("Error ❌");
//         }
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

//             {/* TEAM LIST */}
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

//             {/* LEFT PANEL */}
//             <div className="left-panel">
//                 <h3>Unsold Players</h3>

//                 {loading && <p>Loading...</p>}

//                 {players.filter(p => p.status !== "sold").map(p => (
//                     <div
//                         key={p._id}
//                         className="player-row"
//                         onClick={() => {
//                             setCurrentPlayer(p);
//                             setSelectedTeam(null);
//                         }}
//                     >
//                         <img
//                             src={getImg(p.photo)}
//                             onError={(e) => e.target.src = "/default.jpg"}
//                             alt=""
//                         />
//                         <div>{p.name}</div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Auction;

// ============================================
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "../api";
import "./Auction.css";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

        if (photo.startsWith("http")) return photo;

        if (photo.startsWith("uploads/")) {
            return `${BASE_URL}/${photo}`;
        }

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

            if (!res.ok) throw new Error();

            setTeamName("");
            loadData();
        } catch {
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

            if (!res.ok) throw new Error();

            loadData();
            if (selectedTeam?._id === id) setSelectedTeam(null);

        } catch {
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

    /* ================= EXPORT PDF ================= */
    const downloadPDF = async () => {
        const pdf = new jsPDF();

        // ================= LOGO =================
        const logoUrl = "/logo.png"; // put logo in public folder
        const getBase64 = async (url) => {
            const res = await fetch(url);
            const blob = await res.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        };

        let logoBase64 = "";
        try {
            logoBase64 = await getBase64(logoUrl);
            pdf.addImage(logoBase64, "PNG", 10, 5, 20, 20);
        } catch { }

        // ================= HEADER =================
        pdf.setFontSize(16);
        pdf.text(selectedTeam.name.toUpperCase(), 105, 15, { align: "center" });

        pdf.setFontSize(10);
        pdf.text("Team Players List", 105, 22, { align: "center" });

        // ================= CARD SETTINGS =================
        let x = 10;
        let y = 30;

        const cardWidth = 90;
        const cardHeight = 60;
        const gap = 10;

        for (let p of selectedTeam.players) {
            const player = p.playerId;

            // DRAW CARD
            pdf.setDrawColor(0);
            pdf.rect(x, y, cardWidth, cardHeight);

            // IMAGE
            try {
                const imgBase64 = await getBase64(getImg(player.photo));
                pdf.addImage(imgBase64, "JPEG", x + 3, y + 3, 25, 25);
            } catch { }

            // TEXT
            pdf.setFontSize(10);

            pdf.text(`Name: ${player.name}`, x + 30, y + 10);
            pdf.text(`Role: ${player.role}`, x + 30, y + 16);
            pdf.text(`Village: ${player.village}`, x + 30, y + 22);

            pdf.text(`Bid: ₹${p.price}`, x + 5, y + 35);
            pdf.text(`Shirt: ${player.tshirtSize}`, x + 5, y + 42);
            pdf.text(`Pant: ${player.pantSize}`, x + 5, y + 49);

            // NEXT POSITION
            x += cardWidth + gap;

            if (x + cardWidth > 200) {
                x = 10;
                y += cardHeight + gap;
            }

            // NEW PAGE
            if (y + cardHeight > 280) {
                pdf.addPage();
                x = 10;
                y = 20;
            }
        }

        pdf.save(`${selectedTeam.name}.pdf`);
    };

    /* ================= EXPORT EXCEL ================= */
    const downloadExcel = () => {
        const data = selectedTeam.players.map(p => ({
            Name: p.playerId.name,
            Price: p.price
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Team");
        XLSX.writeFile(wb, "team.xlsx");
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
                <button className="create-btn" onClick={createTeam}>
                    Create
                </button>
            </div>

            {/* TEAM BAR */}
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

            <div className="main-layout">

                {/* LEFT PANEL */}
                <div className="left-panel">
                    <h3>Unsold Players</h3>

                    {loading && <p>Loading...</p>}

                    {players
                        .filter(p => p.status !== "sold")
                        .map(p => (
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

                {/* RIGHT PANEL */}
                <div className="right-panel">

                    {/* TEAM VIEW */}
                    {selectedTeam && (
                        <div>

                            {/* EXPORT BUTTONS */}
                            <div style={{ marginBottom: "15px" }}>
                                <button onClick={downloadPDF}>Export PDF</button>
                                <button onClick={downloadExcel}>Export Excel</button>
                            </div>

                            <h2>{selectedTeam.name} Players</h2>

                            <div className="team-grid">
                                {selectedTeam.players?.map(p => (
                                    <div className="team-card" key={p._id}>

                                        <img
                                            src={getImg(p.playerId?.photo)}
                                            onError={(e) => e.target.src = "/default.jpg"}
                                            alt=""
                                        />

                                        <h3>{p.playerId?.name}</h3>
                                        <p>₹{p.price}</p>

                                        <button
                                            onClick={() =>
                                                unsoldPlayer(
                                                    p.playerId?._id,
                                                    selectedTeam?._id
                                                )
                                            }
                                        >
                                            ❌ Unsold
                                        </button>

                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AUCTION CARD */}
                    {!selectedTeam && currentPlayer && (
                        <div className="auction-card">

                            <div className="card-left">
                                <img src={getImg(currentPlayer.photo)} alt="" />
                            </div>

                            <div className="card-right">

                                <h2>{currentPlayer.name}</h2>
                                <p>{currentPlayer.role}</p>

                                <h1>₹{price}</h1>

                                <div className="bid-buttons">
                                    <button onClick={() => setPrice(price + 100)}>+100</button>
                                    <button onClick={() => setPrice(price + 200)}>+200</button>
                                    <button onClick={() => setPrice(price + 500)}>+500</button>
                                    <button onClick={() => setPrice(price + 1000)}>+1000</button>
                                </div>

                                <input
                                    placeholder="Enter total bid"
                                    value={customBid}
                                    onChange={(e) => {
                                        setCustomBid(e.target.value);
                                        setPrice(Number(e.target.value));
                                    }}
                                />

                                <select onChange={(e) => setTeamId(e.target.value)}>
                                    <option>Select Team</option>
                                    {teams.map(t => (
                                        <option key={t._id} value={t._id}>
                                            {t.name}
                                        </option>
                                    ))}
                                </select>

                                <button className="sell-btn" onClick={sellPlayer}>
                                    SELL PLAYER
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