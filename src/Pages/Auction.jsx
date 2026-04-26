// // import { useParams } from "react-router-dom";
// // import { useState, useEffect } from "react";
// // import BASE_URL from "../api";
// // import "./Auction.css";

// // import jsPDF from "jspdf";
// // import html2canvas from "html2canvas";
// // import * as XLSX from "xlsx";

// // function Auction() {
// //     const { leagueId } = useParams();

// //     const [players, setPlayers] = useState([]);
// //     const [teams, setTeams] = useState([]);
// //     const [selectedTeam, setSelectedTeam] = useState(null);
// //     const [currentPlayer, setCurrentPlayer] = useState(null);

// //     const [teamName, setTeamName] = useState("");
// //     const [teamPurse, setTeamPurse] = useState(100000);

// //     const [teamId, setTeamId] = useState("");
// //     const [price, setPrice] = useState(0);
// //     const [customBid, setCustomBid] = useState("");

// //     const [loading, setLoading] = useState(false);

// //     useEffect(() => {
// //         loadData();
// //     }, [leagueId]);

// //     /* ================= LOAD DATA ================= */
// //     const loadData = async () => {
// //         try {
// //             setLoading(true);

// //             const p = await fetch(`${BASE_URL}/api/players/${leagueId}`);
// //             const t = await fetch(`${BASE_URL}/api/teams/with-players/${leagueId}`);

// //             const playersData = await p.json();
// //             const teamsData = await t.json();

// //             setPlayers(Array.isArray(playersData) ? playersData : []);
// //             setTeams(Array.isArray(teamsData) ? teamsData : []);

// //         } catch (err) {
// //             console.error("Error loading data", err);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     /* ================= IMAGE FIX ================= */
// //     const getImg = (photo) => {
// //         if (!photo) return "/default.jpg";

// //         if (photo.startsWith("http")) return photo;

// //         if (photo.startsWith("uploads/")) {
// //             return `${BASE_URL}/${photo}`;
// //         }

// //         return `${BASE_URL}/uploads/${photo}`;
// //     };

// //     /* ================= CREATE TEAM ================= */
// //     const createTeam = async () => {
// //         if (!teamName) return alert("Enter team name");

// //         try {
// //             const res = await fetch(`${BASE_URL}/api/teams`, {
// //                 method: "POST",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify({
// //                     name: teamName,
// //                     purse: teamPurse,
// //                     leagueId
// //                 })
// //             });

// //             if (!res.ok) throw new Error();

// //             setTeamName("");
// //             loadData();
// //         } catch {
// //             alert("Error creating team ❌");
// //         }
// //     };

// //     /* ================= DELETE TEAM ================= */
// //     const deleteTeam = async (id) => {
// //         if (!window.confirm("Delete this team?")) return;

// //         try {
// //             const res = await fetch(`${BASE_URL}/api/teams/${id}`, {
// //                 method: "DELETE"
// //             });

// //             if (!res.ok) throw new Error();

// //             loadData();
// //             if (selectedTeam?._id === id) setSelectedTeam(null);

// //         } catch {
// //             alert("Delete failed ❌");
// //         }
// //     };

// //     /* ================= SELL PLAYER ================= */
// //     const sellPlayer = async () => {
// //         if (!teamId) return alert("Select team");

// //         try {
// //             const res = await fetch(`${BASE_URL}/api/teams/add-player`, {
// //                 method: "POST",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify({
// //                     teamId,
// //                     playerId: currentPlayer._id,
// //                     price
// //                 })
// //             });

// //             if (!res.ok) throw new Error();

// //             setCurrentPlayer(null);
// //             setPrice(0);
// //             setCustomBid("");
// //             loadData();

// //         } catch {
// //             alert("Sell failed ❌");
// //         }
// //     };

// //     /* ================= UNSOLD PLAYER ================= */
// //     const unsoldPlayer = async (playerId, teamId) => {
// //         try {
// //             const res = await fetch(`${BASE_URL}/api/teams/remove-player`, {
// //                 method: "POST",
// //                 headers: { "Content-Type": "application/json" },
// //                 body: JSON.stringify({ playerId, teamId })
// //             });

// //             if (!res.ok) throw new Error();

// //             loadData();
// //         } catch {
// //             alert("Error ❌");
// //         }
// //     };

// //     /* ================= EXPORT PDF ================= */
// //     const downloadPDF = async () => {
// //         if (!activeTeamTab) {
// //             alert("Select team first");
// //             return;
// //         }

// //         const pdf = new jsPDF();

// //         const getBase64 = async (url) => {
// //             try {
// //                 const res = await fetch(url);
// //                 const blob = await res.blob();
// //                 return new Promise((resolve) => {
// //                     const reader = new FileReader();
// //                     reader.onloadend = () => resolve(reader.result);
// //                     reader.readAsDataURL(blob);
// //                 });
// //             } catch {
// //                 return null;
// //             }
// //         };

// //         // ✅ GET TEAM OBJECT CORRECTLY
// //         const team = teams.find(t => t._id === activeTeamTab);

// //         if (!team) {
// //             alert("Team not found");
// //             return;
// //         }

// //         // ===== HEADER =====
// //         pdf.setFontSize(18);
// //         pdf.setFont(undefined, "bold");
// //         pdf.text(team.name.toUpperCase(), 105, 12, { align: "center" });

// //         pdf.setFontSize(11);
// //         pdf.setFont(undefined, "normal");
// //         pdf.text("Team Players List", 105, 18, { align: "center" });

// //         // ===== CARD SETTINGS =====
// //         let x = 10;
// //         let y = 30;

// //         const cardWidth = 90;
// //         const cardHeight = 50;
// //         const gap = 10;

// //         const players = team.players || [];

// //         for (let p of players) {
// //             const player = p.playerId;

// //             if (!player) continue; // safety

// //             // CARD BORDER
// //             pdf.setDrawColor(200);
// //             pdf.rect(x, y, cardWidth, cardHeight);

// //             // IMAGE (SAFE)
// //             try {
// //                 const img = await getBase64(getImg(player.photo));
// //                 if (img) {
// //                     pdf.addImage(img, "JPEG", x + 3, y + 5, 20, 20);
// //                 }
// //             } catch { }

// //             // NAME
// //             pdf.setFontSize(11);
// //             pdf.setFont(undefined, "bold");
// //             pdf.text((player.name || "").toUpperCase(), x + 28, y + 10);

// //             // ROLE + VILLAGE
// //             pdf.setFontSize(9);
// //             pdf.setFont(undefined, "normal");
// //             pdf.text(player.role || "-", x + 28, y + 16);
// //             pdf.text(player.village || "-", x + 28, y + 21);

// //             // LINE
// //             pdf.setDrawColor(220);
// //             pdf.line(x + 3, y + 28, x + cardWidth - 3, y + 28);

// //             // DETAILS
// //             pdf.setFontSize(9);
// //             pdf.text(`Bid: ₹${p.price || 0}`, x + 5, y + 35);
// //             pdf.text(`Shirt: ${player.tshirtSize || "-"}`, x + 5, y + 41);
// //             pdf.text(`Pant: ${player.pantSize || "-"}`, x + 45, y + 41);

// //             // NEXT POSITION
// //             x += cardWidth + gap;

// //             if (x + cardWidth > 200) {
// //                 x = 10;
// //                 y += cardHeight + gap;
// //             }

// //             if (y + cardHeight > 280) {
// //                 pdf.addPage();
// //                 x = 10;
// //                 y = 20;
// //             }
// //         }

// //         pdf.save(`${team.name}.pdf`);
// //     };

// //     /* ================= EXPORT EXCEL ================= */
// //     const downloadExcel = () => {
// //         const data = selectedTeam.players.map(p => ({
// //             Name: p.playerId.name,
// //             Price: p.price
// //         }));

// //         const ws = XLSX.utils.json_to_sheet(data);
// //         const wb = XLSX.utils.book_new();

// //         XLSX.utils.book_append_sheet(wb, ws, "Team");
// //         XLSX.writeFile(wb, "team.xlsx");
// //     };

// //     return (
// //         <div className="auction-page">

// //             {/* CREATE TEAM */}
// //             <div className="top-bar">
// //                 <input
// //                     placeholder="Team Name"
// //                     value={teamName}
// //                     onChange={(e) => setTeamName(e.target.value)}
// //                 />
// //                 <input
// //                     type="number"
// //                     value={teamPurse}
// //                     onChange={(e) => setTeamPurse(e.target.value)}
// //                 />
// //                 <button className="create-btn" onClick={createTeam}>
// //                     Create
// //                 </button>
// //             </div>

// //             {/* TEAM BAR */}
// //             <div className="team-bar">
// //                 {teams.map(t => (
// //                     <div
// //                         key={t._id}
// //                         className={`team-pill ${selectedTeam?._id === t._id ? "active" : ""}`}
// //                         onClick={() => {
// //                             setSelectedTeam(t);
// //                             setCurrentPlayer(null);
// //                         }}
// //                     >
// //                         {t.name} ₹{t.purse}

// //                         <span
// //                             onClick={(e) => {
// //                                 e.stopPropagation();
// //                                 deleteTeam(t._id);
// //                             }}
// //                         >
// //                             ❌
// //                         </span>
// //                     </div>
// //                 ))}
// //             </div>

// //             <div className="main-layout">

// //                 {/* LEFT PANEL */}
// //                 <div className="left-panel">
// //                     <h3>Unsold Players</h3>

// //                     {loading && <p>Loading...</p>}

// //                     {players
// //                         .filter(p => p.status !== "sold")
// //                         .map(p => (
// //                             <div
// //                                 key={p._id}
// //                                 className="player-row"
// //                                 onClick={() => {
// //                                     setCurrentPlayer(p);
// //                                     setSelectedTeam(null);
// //                                 }}
// //                             >
// //                                 <img
// //                                     src={getImg(p.photo)}
// //                                     onError={(e) => e.target.src = "/default.jpg"}
// //                                     alt=""
// //                                 />
// //                                 <div>{p.name}</div>
// //                             </div>
// //                         ))}
// //                 </div>

// //                 {/* RIGHT PANEL */}
// //                 <div className="right-panel">

// //                     {/* TEAM VIEW */}
// //                     {selectedTeam && (
// //                         <div>

// //                             {/* EXPORT BUTTONS */}
// //                             <div style={{ marginBottom: "15px" }}>
// //                                 <button onClick={downloadPDF}>Export PDF</button>
// //                                 <button onClick={downloadExcel}>Export Excel</button>
// //                             </div>

// //                             <h2>{selectedTeam.name} Players</h2>

// //                             <div className="team-grid">
// //                                 {selectedTeam.players?.map(p => (
// //                                     <div className="team-card" key={p._id}>

// //                                         <img
// //                                             src={getImg(p.playerId?.photo)}
// //                                             onError={(e) => e.target.src = "/default.jpg"}
// //                                             alt=""
// //                                         />

// //                                         <h3>{p.playerId?.name}</h3>
// //                                         <p>₹{p.price}</p>

// //                                         <button
// //                                             onClick={() =>
// //                                                 unsoldPlayer(
// //                                                     p.playerId?._id,
// //                                                     selectedTeam?._id
// //                                                 )
// //                                             }
// //                                         >
// //                                             ❌ Unsold
// //                                         </button>

// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         </div>
// //                     )}

// //                     {/* AUCTION CARD */}
// //                     {!selectedTeam && currentPlayer && (
// //                         <div className="auction-card">

// //                             <div className="card-left">
// //                                 <img src={getImg(currentPlayer.photo)} alt="" />
// //                             </div>

// //                             <div className="card-right">

// //                                 <h2>{currentPlayer.name}</h2>
// //                                 <p>{currentPlayer.role}</p>

// //                                 <h1>₹{price}</h1>

// //                                 <div className="bid-buttons">
// //                                     <button onClick={() => setPrice(price + 100)}>+100</button>
// //                                     <button onClick={() => setPrice(price + 200)}>+200</button>
// //                                     <button onClick={() => setPrice(price + 500)}>+500</button>
// //                                     <button onClick={() => setPrice(price + 1000)}>+1000</button>
// //                                 </div>

// //                                 <input
// //                                     placeholder="Enter total bid"
// //                                     value={customBid}
// //                                     onChange={(e) => {
// //                                         setCustomBid(e.target.value);
// //                                         setPrice(Number(e.target.value));
// //                                     }}
// //                                 />

// //                                 <select onChange={(e) => setTeamId(e.target.value)}>
// //                                     <option>Select Team</option>
// //                                     {teams.map(t => (
// //                                         <option key={t._id} value={t._id}>
// //                                             {t.name}
// //                                         </option>
// //                                     ))}
// //                                 </select>

// //                                 <button className="sell-btn" onClick={sellPlayer}>
// //                                     SELL PLAYER
// //                                 </button>

// //                             </div>
// //                         </div>
// //                     )}

// //                 </div>

// //             </div>

// //         </div>
// //     );
// // }

// // export default Auction;

// // =================================


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

//             setPlayers(await p.json());
//             setTeams(await t.json());

//         } catch (err) {
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ================= IMAGE FIX ================= */
//     const getImg = (photo) => {
//         if (!photo) return "/default.jpg";
//         if (photo.startsWith("http")) return photo;
//         if (photo.startsWith("uploads/")) return `${BASE_URL}/${photo}`;
//         return `${BASE_URL}/uploads/${photo}`;
//     };

//     /* ================= CREATE TEAM ================= */
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

//     /* ================= DELETE TEAM ================= */
//     const deleteTeam = async (id) => {
//         if (!window.confirm("Delete this team?")) return;

//         await fetch(`${BASE_URL}/api/teams/${id}`, { method: "DELETE" });
//         loadData();

//         if (selectedTeam?._id === id) setSelectedTeam(null);
//     };

//     /* ================= SELL PLAYER ================= */
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
//         loadData();
//     };

//     /* ================= UNSOLD ================= */
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

//         pdf.setFontSize(18);
//         pdf.text(selectedTeam.name.toUpperCase(), 105, 12, { align: "center" });

//         pdf.setFontSize(11);
//         pdf.text("Team Players List", 105, 18, { align: "center" });

//         let x = 10, y = 30;

//         const cardWidth = 90;
//         const cardHeight = 50;

//         for (let p of selectedTeam.players || []) {
//             const player = p.playerId;
//             if (!player) continue;

//             pdf.rect(x, y, cardWidth, cardHeight);

//             pdf.setFontSize(10);
//             pdf.img(player.photo ? getImg(player.photo) : "/default.jpg", "JPEG", x + 3, y + 5, 20, 20);
//             pdf.text(player.name || "", x + 5, y + 10);
//             pdf.text(player.role || "-", x + 5, y + 16);
//             pdf.text(player.village || "-", x + 5, y + 22);
//             pdf.text(`Shirt: ${player.tshirtSize || "-"}`, x + 5, y + 28);
//             pdf.text(`Pant: ${player.pantSize || "-"}`, x + 45, y + 28);

//             pdf.text(`₹${p.price}`, x + 5, y + 30);

//             x += 100;
//             if (x > 180) {
//                 x = 10;
//                 y += 60;
//             }
//         }

//         pdf.save(`${selectedTeam.name}.pdf`);
//     };

//     /* ================= EXCEL ================= */
//     const downloadExcel = () => {
//         if (!selectedTeam) return alert("Select team first");

//         const data = (selectedTeam.players || []).map(p => ({
//             Name: p.playerId?.name,
//             Price: p.price
//         }));

//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();

//         XLSX.utils.book_append_sheet(wb, ws, "Team");
//         XLSX.writeFile(wb, "team.xlsx");
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
//                     <div
//                         key={t._id}
//                         className={`team-pill ${selectedTeam?._id === t._id ? "active" : ""}`}
//                         onClick={() => {
//                             setSelectedTeam(t);
//                             setCurrentPlayer(null);
//                         }}
//                     >
//                         {t.name} ₹{t.purse}
//                         <span onClick={(e) => {
//                             e.stopPropagation();
//                             deleteTeam(t._id);
//                         }}>❌</span>
//                     </div>
//                 ))}
//             </div>

//             <div className="main-layout">

//                 <div className="left-panel">
//                     {players.filter(p => p.status !== "sold").map(p => (
//                         <div key={p._id} className="player-row" onClick={() => setCurrentPlayer(p)}>
//                             <img src={getImg(p.photo)} onError={(e) => e.target.src = "/default.jpg"} />
//                             <div>{p.name}</div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="right-panel">

//                     {selectedTeam && (
//                         <>
//                             <button onClick={downloadPDF}>PDF</button>
//                             <button onClick={downloadExcel}>Excel</button>

//                             {selectedTeam.players?.map(p => (
//                                 <div key={p._id}>
//                                     {p.playerId?.name} ₹{p.price}
//                                 </div>
//                             ))}
//                         </>
//                     )}

//                     {!selectedTeam && currentPlayer && (
//                         <div>
//                             <h2>{currentPlayer.name}</h2>

//                             <select onChange={(e) => setTeamId(e.target.value)}>
//                                 <option>Select Team</option>
//                                 {teams.map(t => (
//                                     <option key={t._id} value={t._id}>{t.name}</option>
//                                 ))}
//                             </select>

//                             <button onClick={sellPlayer}>SELL</button>
//                         </div>
//                     )}

//                 </div>

//             </div>

//         </div>
//     );
// }

// export default Auction;












// ======================================





import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "../api";
import "./Auction.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

    useEffect(() => {
        loadData();
    }, [leagueId]);

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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getImg = (photo) => {
        if (!photo) return "/default.jpg";
        if (photo.startsWith("http")) return photo;
        if (photo.startsWith("uploads/")) return `${BASE_URL}/${photo}`;
        return `${BASE_URL}/uploads/${photo}`;
    };

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

    const sellPlayer = async () => {
        if (!teamId) return alert("Select team");

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

    /* ✅ FIXED PDF */
    const downloadPDF = async () => {
        if (!selectedTeam) return alert("Select team first");

        const pdf = new jsPDF();

        // 🔹 convert image → base64 (stable version)
        const getBase64 = async (url) => {
            try {
                const res = await fetch(url, { mode: "cors" });
                const blob = await res.blob();

                return await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
            } catch {
                return null;
            }
        };

        // 🎯 HEADER
        pdf.setFillColor(15, 23, 42); // dark header
        pdf.rect(0, 0, 210, 25, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(18);
        pdf.text(selectedTeam.name.toUpperCase(), 105, 15, { align: "center" });

        pdf.setTextColor(0, 0, 0);

        let x = 10;
        let y = 35;

        const cardWidth = 90;
        const cardHeight = 60;
        const gap = 10;

        for (let p of selectedTeam.players || []) {
            const player = p.playerId;
            if (!player) continue;

            // 🟦 CARD BACKGROUND
            pdf.setFillColor(248, 250, 252);
            pdf.roundedRect(x, y, cardWidth, cardHeight, 4, 4, "F");

            // 🟩 TOP STRIP (design)
            pdf.setFillColor(34, 197, 94);
            pdf.rect(x, y, cardWidth, 8, "F");

            // 🖼 IMAGE
            const img = await getBase64(getImg(player.photo));

            if (img) {
                const format = img.includes("png") ? "PNG" : "JPEG";
                pdf.addImage(img, format, x + 3, y + 12, 22, 22);
            } else {
                // fallback box
                pdf.setDrawColor(200);
                pdf.rect(x + 3, y + 12, 22, 22);
                pdf.setFontSize(7);
                pdf.text("No Img", x + 6, y + 24);
            }

            // 🧑 NAME
            pdf.setFontSize(11);
            pdf.setFont(undefined, "bold");
            pdf.text((player.name || "-").slice(0, 18), x + 28, y + 16);

            // 🎭 ROLE + VILLAGE
            pdf.setFontSize(9);
            pdf.setFont(undefined, "normal");
            pdf.text(`Role: ${player.role || "-"}`, x + 28, y + 22);
            pdf.text(`Village: ${player.village || "-"}`, x + 28, y + 28);

            // 📏 SIZES
            pdf.text(`Shirt: ${player.tshirtSize || "-"}`, x + 5, y + 45);
            pdf.text(`Pant: ${player.pantSize || "-"}`, x + 45, y + 45);

            // 💰 BID (highlight)
            pdf.setFont(undefined, "bold");
            pdf.setTextColor(22, 163, 74);
            pdf.text(`₹ ${p.price}`, x + 5, y + 55);

            pdf.setTextColor(0, 0, 0);

            // ➡️ NEXT POSITION
            x += cardWidth + gap;

            if (x + cardWidth > 200) {
                x = 10;
                y += cardHeight + gap;
            }

            // ➕ NEW PAGE
            if (y + cardHeight > 280) {
                pdf.addPage();
                x = 10;
                y = 20;
            }
        }

        pdf.save(`${selectedTeam.name}_premium.pdf`);
    };

    const downloadExcel = () => {
        if (!selectedTeam) return alert("Select team first");

        const data = (selectedTeam.players || []).map(p => ({
            Name: p.playerId?.name,
            Role: p.playerId?.role,
            Village: p.playerId?.village,
            Price: p.price
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Team");
        XLSX.writeFile(wb, `${selectedTeam.name}.xlsx`);
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
                <button onClick={createTeam}>Create</button>
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
                        <span onClick={(e) => {
                            e.stopPropagation();
                            deleteTeam(t._id);
                        }}>❌</span>
                    </div>
                ))}
            </div>

            <div className="main-layout">

                {/* LEFT */}
                <div className="left-panel">
                    <h3>Unsold Players</h3>

                    {loading && <p>Loading...</p>}

                    {players.filter(p => p.status !== "sold").map(p => (
                        <div key={p._id} className="player-row"
                            onClick={() => {
                                setCurrentPlayer(p);
                                setSelectedTeam(null);
                            }}>
                            <img src={getImg(p.photo)} alt="" />
                            <div>{p.name}</div>
                        </div>
                    ))}
                </div>

                {/* RIGHT */}
                <div className="right-panel">

                    {selectedTeam && (
                        <>
                            <div className="export-buttons">
                                <button onClick={downloadPDF}>PDF</button>
                                <button onClick={downloadExcel}>Excel</button>
                            </div>

                            <h2>{selectedTeam.name} Players</h2>

                            <div className="team-grid">
                                {selectedTeam.players?.map(p => (
                                    <div className="team-card" key={p._id}>
                                        <img src={getImg(p.playerId?.photo)} alt="" />
                                        <h3>{p.playerId?.name}</h3>
                                        <p>{p.playerId?.role}</p>
                                        <p>₹{p.price}</p>

                                        <button onClick={() =>
                                            unsoldPlayer(p.playerId?._id, selectedTeam?._id)
                                        }>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {!selectedTeam && currentPlayer && (
                        <div className="auction-card">
                            <img src={getImg(currentPlayer.photo)} alt="" />

                            <h2>{currentPlayer.name}</h2>
                            <p>{currentPlayer.role}</p>

                            <h1>₹{price}</h1>

                            <button onClick={() => setPrice(price + 100)}>+100</button>
                            <button onClick={() => setPrice(price + 500)}>+500</button>

                            <select onChange={(e) => setTeamId(e.target.value)}>
                                <option>Select Team</option>
                                {teams.map(t => (
                                    <option key={t._id} value={t._id}>{t.name}</option>
                                ))}
                            </select>

                            <button onClick={sellPlayer}>SELL PLAYER</button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
console.log(getImg(player.photo));

export default Auction;