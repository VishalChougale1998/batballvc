// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import BASE_URL from "../api";
// import * as XLSX from "xlsx";
// import jsPDF from "jspdf";
// import "./Auction.css";

// function Auction() {
//     const { leagueId } = useParams();

//     const [players, setPlayers] = useState([]);
//     const [teams, setTeams] = useState([]);
//     const [selectedTeam, setSelectedTeam] = useState(null);
//     const [currentPlayer, setCurrentPlayer] = useState(null);

//     const [teamName, setTeamName] = useState("");
//     const [teamPurse, setTeamPurse] = useState(50000);

//     const [teamId, setTeamId] = useState("");
//     const [price, setPrice] = useState(0);
//     const [customAmount, setCustomAmount] = useState("");

//     // 🔥 FINAL IMAGE FIX (NO BUG)
//     const getImageUrl = (photo) => {
//         if (!photo || photo === "null" || photo === "undefined") {
//             return "https://via.placeholder.com/100";
//         }

//         const clean = photo.replace(/^\/?uploads\//, "");
//         return `${BASE_URL}/uploads/${clean}`;
//     };

//     useEffect(() => {
//         loadData();
//     }, [leagueId]);

//     const loadData = async () => {
//         try {
//             const pRes = await fetch(`${BASE_URL}/api/players/${leagueId}`);
//             const pData = await pRes.json();

//             const tRes = await fetch(`${BASE_URL}/api/teams/with-players/${leagueId}`);
//             const tData = await tRes.json();

//             setPlayers(pData || []);
//             setTeams(tData || []);
//         } catch (err) {
//             console.error("Load Error:", err);
//         }
//     };

//     // ================= CREATE TEAM =================
//     const createTeam = async () => {
//         if (!teamName) return alert("Enter team name");

//         await fetch(`${BASE_URL}/api/teams`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 name: teamName,
//                 purse: Number(teamPurse),
//                 leagueId,
//             }),
//         });

//         setTeamName("");
//         loadData();
//     };

//     // ================= SELL PLAYER =================
//     const sellPlayer = async () => {
//         if (!teamId) return alert("Select team");
//         if (!currentPlayer) return;
//         if (price <= 0) return alert("Enter valid price");

//         try {
//             const res = await fetch(`${BASE_URL}/api/teams/add-player`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     teamId,
//                     playerId: currentPlayer._id,
//                     price,
//                 }),
//             });

//             const data = await res.json();

//             if (!data.success) {
//                 return alert(data.msg || "Failed ❌");
//             }

//             alert("Player Sold ✅");

//             setCurrentPlayer(null);
//             setPrice(0);
//             setTeamId("");
//             setCustomAmount("");

//             loadData();

//         } catch (err) {
//             console.log(err);
//             alert("Error ❌");
//         }
//     };

//     // ================= UNSOLD PLAYER =================
//     const unsoldPlayer = async (playerId, teamId) => {
//         try {
//             const res = await fetch(`${BASE_URL}/api/teams/remove-player`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ playerId, teamId })
//             });

//             const data = await res.json();

//             if (!data.success) {
//                 return alert(data.msg || "Failed ❌");
//             }

//             alert(`Player Unsold ✅ ₹${data.refunded} refunded`);

//             await loadData();
//             setSelectedTeam(null);

//         } catch (err) {
//             console.log(err);
//             alert("Failed ❌");
//         }
//     };

//     // ================= EXPORT =================
//     const exportExcel = () => {
//         if (!selectedTeam) return;

//         const data = selectedTeam.players.map((p) => ({
//             Name: p.playerId?.name || "-",
//             Role: p.playerId?.role || "-",
//             Price: p.price || 0,
//         }));

//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Players");
//         XLSX.writeFile(wb, `${selectedTeam.name}.xlsx`);
//     };

//     const exportPDF = () => {
//         if (!selectedTeam) return;

//         const doc = new jsPDF();
//         let y = 20;

//         doc.text(selectedTeam.name, 105, 20, { align: "center" });

//         selectedTeam.players.forEach((p, i) => {
//             doc.text(`${i + 1}. ${p.playerId?.name} - ₹${p.price}`, 10, y);
//             y += 10;
//         });

//         doc.save(`${selectedTeam.name}.pdf`);
//     };

//     return (
//         <div className="auction-container">

//             {/* CREATE TEAM */}
//             <div className="create-team">
//                 <input
//                     placeholder="Team Name"
//                     value={teamName}
//                     onChange={(e) => setTeamName(e.target.value)}
//                 />
//                 <input
//                     type="number"
//                     placeholder="Purse"
//                     value={teamPurse}
//                     onChange={(e) => setTeamPurse(e.target.value)}
//                 />
//                 <button onClick={createTeam}>Create Team</button>
//             </div>

//             {/* TEAM BAR */}
//             <div className="team-bar">
//                 {teams.map((t) => (
//                     <div
//                         key={t._id}
//                         className={`team-pill ${selectedTeam?._id === t._id ? "active" : ""}`}
//                         onClick={() => setSelectedTeam(t)}
//                     >
//                         {t.name} ₹{t.purse}
//                     </div>
//                 ))}
//             </div>

//             {/* MAIN */}
//             <div className="main">

//                 {/* LEFT PLAYERS */}
//                 <div className="left">
//                     <h3>
//                         Players: {players.filter(p => p.status !== "sold").length}
//                     </h3>

//                     {players
//                         .filter(p => p.status !== "sold")
//                         .map(p => (
//                             <div
//                                 key={p._id}
//                                 className="player"
//                                 onClick={() => {
//                                     setCurrentPlayer(p);
//                                     setPrice(0);
//                                 }}
//                             >
//                                 <img src={getImageUrl(p.photo)} alt="player" />

//                                 <div>
//                                     <b>{p.name}</b>
//                                     <small>{p.role}</small>
//                                 </div>
//                             </div>
//                         ))}
//                 </div>

//                 {/* RIGHT AUCTION */}
//                 <div className="auction-stage">

//                     {/* PLAYER IMAGE BIG */}
//                     <img
//                         src={getImageUrl(currentPlayer.photo)}
//                         className="stage-img"
//                     />

//                     {/* DETAILS */}
//                     <h1 className="stage-name">{currentPlayer.name}</h1>
//                     <p className="stage-role">{currentPlayer.role}</p>

//                     <h2 className="stage-price">₹{price}</h2>

//                     {/* BID BUTTONS */}
//                     <div className="stage-bids">
//                         <button onClick={() => setPrice(price + 100)}>+100</button>
//                         <button onClick={() => setPrice(price + 500)}>+500</button>
//                         <button onClick={() => setPrice(price + 1000)}>+1000</button>
//                         <button onClick={() => setPrice(price + 5000)}>+5000</button>
//                     </div>

//                     {/* CONTROLS */}
//                     <div className="stage-controls">

//                         <input
//                             type="number"
//                             placeholder="Enter Bid Amount"
//                             value={customAmount}
//                             onChange={(e) => {
//                                 setCustomAmount(e.target.value);
//                                 setPrice(Number(e.target.value));
//                             }}
//                         />

//                         <select onChange={(e) => setTeamId(e.target.value)}>
//                             <option value="">Select Team</option>
//                             {teams.map(t => (
//                                 <option key={t._id} value={t._id}>
//                                     {t.name} (₹{t.purse})
//                                 </option>
//                             ))}
//                         </select>

//                         <button onClick={sellPlayer} className="sell-btn">
//                             SELL PLAYER
//                         </button>

//                     </div>

//                 </div>
//             </div>

//             {/* TEAM PLAYERS */}
//             {selectedTeam && (
//                 <div className="team-section">
//                     <h2>{selectedTeam.name}</h2>

//                     <button onClick={exportExcel}>Excel</button>
//                     <button onClick={exportPDF}>PDF</button>

//                     <div className="cards">
//                         {selectedTeam.players.map(p => (
//                             <div key={p._id} className="card">

//                                 <img src={getImageUrl(p.playerId?.photo)} alt="player" />

//                                 <p>{p.playerId?.name}</p>
//                                 <p>₹{p.price}</p>

//                                 <button
//                                     style={{ background: "red", color: "white" }}
//                                     onClick={() =>
//                                         unsoldPlayer(p.playerId._id, selectedTeam._id)
//                                     }
//                                 >
//                                     Unsold
//                                 </button>

//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//         </div>
//     );
// }

// export default Auction;


// ====================

// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import BASE_URL from "../api";
// import "./Auction.css";

// function Auction() {
//     const { leagueId } = useParams();

//     const [players, setPlayers] = useState([]);
//     const [teams, setTeams] = useState([]);
//     const [currentPlayer, setCurrentPlayer] = useState(null);

//     const [teamName, setTeamName] = useState("");
//     const [teamPurse, setTeamPurse] = useState(50000);

//     const [teamId, setTeamId] = useState("");
//     const [price, setPrice] = useState(0);
//     const [customBid, setCustomBid] = useState("");

//     // ✅ IMAGE FIX
//     const getImg = (photo) => {
//         if (!photo) return "https://via.placeholder.com/150";
//         return `${BASE_URL}/uploads/${photo}`;
//     };

//     useEffect(() => {
//         loadData();
//     }, [leagueId]);

//     const loadData = async () => {
//         const p = await fetch(`${BASE_URL}/api/players/${leagueId}`);
//         const t = await fetch(`${BASE_URL}/api/teams/${leagueId}`);

//         setPlayers(await p.json());
//         setTeams(await t.json());
//     };

//     // ================= CREATE TEAM =================
//     const createTeam = async () => {
//         if (!teamName) return alert("Enter team name");

//         await fetch(`${BASE_URL}/api/teams`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 name: teamName,
//                 purse: Number(teamPurse),
//                 leagueId
//             })
//         });

//         setTeamName("");
//         loadData();
//     };

//     // ================= SELL =================
//     const sellPlayer = async () => {
//         if (!teamId) return alert("Select team");
//         if (!currentPlayer) return;

//         await fetch(`${BASE_URL}/api/teams/add-player`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 teamId,
//                 playerId: currentPlayer._id,
//                 price
//             })
//         });

//         alert("Player Sold ✅");

//         setCurrentPlayer(null);
//         setPrice(0);
//         setCustomBid("");
//         setTeamId("");

//         loadData();
//     };

//     return (
//         <div className="auction-container">

//             {/* 🔥 CREATE TEAM */}
//             <div className="top-bar">
//                 <input
//                     placeholder="Team Name"
//                     value={teamName}
//                     onChange={(e) => setTeamName(e.target.value)}
//                 />
//                 <input
//                     type="number"
//                     placeholder="Purse"
//                     value={teamPurse}
//                     onChange={(e) => setTeamPurse(e.target.value)}
//                 />
//                 <button onClick={createTeam}>Create Team</button>
//             </div>

//             {/* 🔥 TEAM TABS */}
//             <div className="team-bar">
//                 {teams.map(t => (
//                     <div key={t._id} className="team-pill">
//                         {t.name} ₹{t.purse}
//                     </div>
//                 ))}
//             </div>

//             {/* 🔥 MAIN */}
//             <div className="auction-wrapper">

//                 {/* LEFT - UNSOLD PLAYERS */}
//                 <div className="sidebar">
//                     <h3>
//                         Unsold Players ({players.filter(p => p.status !== "sold").length})
//                     </h3>

//                     {players
//                         .filter(p => p.status !== "sold")
//                         .map(p => (
//                             <div
//                                 key={p._id}
//                                 className="player-row"
//                                 onClick={() => {
//                                     setCurrentPlayer(p);
//                                     setPrice(0);
//                                 }}
//                             >
//                                 <img src={getImg(p.photo)} alt="" />
//                                 <div>
//                                     <b>{p.name}</b>
//                                     <p>{p.role}</p>
//                                 </div>
//                             </div>
//                         ))}
//                 </div>

//                 {/* RIGHT - AUCTION */}
//                 <div className="auction-area">

//                     {!currentPlayer ? (
//                         <h2>Select Player</h2>
//                     ) : (
//                         <div className="auction-card">

//                             {/* LEFT IMAGE */}
//                             <div className="card-left">
//                                 <img src={getImg(currentPlayer.photo)} />
//                             </div>

//                             {/* RIGHT DETAILS */}
//                             <div className="card-right">

//                                 <h2>{currentPlayer.name}</h2>
//                                 <p>{currentPlayer.role}</p>

//                                 <h1>₹{price}</h1>

//                                 {/* BID BUTTONS */}
//                                 <div className="bid-buttons">
//                                     <button onClick={() => setPrice(price + 100)}>+100</button>
//                                     <button onClick={() => setPrice(price + 200)}>+200</button>
//                                     <button onClick={() => setPrice(price + 500)}>+500</button>
//                                     <button onClick={() => setPrice(price + 1000)}>+1000</button>
//                                 </div>

//                                 {/* CUSTOM BID */}
//                                 <input
//                                     className="bid-input"
//                                     placeholder="Enter total bid"
//                                     value={customBid}
//                                     onChange={(e) => {
//                                         setCustomBid(e.target.value);
//                                         setPrice(Number(e.target.value));
//                                     }}
//                                 />

//                                 {/* TEAM SELECT */}
//                                 <select onChange={(e) => setTeamId(e.target.value)} className="select-bid">
//                                     <option value="">Select Team</option>
//                                     {teams.map(t => (
//                                         <option key={t._id} value={t._id}>
//                                             {t.name} (₹{t.purse})
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
// ===============================

// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import BASE_URL from "../api";
// import "./Auction.css";

// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import jsPDF from "jspdf";



// function Auction() {
//     const { leagueId } = useParams();

//     const [players, setPlayers] = useState([]);
//     const [teams, setTeams] = useState([]);
//     const [selectedTeam, setSelectedTeam] = useState(null);
//     const [currentPlayer, setCurrentPlayer] = useState(null);

//     const [teamName, setTeamName] = useState("");
//     const [teamPurse, setTeamPurse] = useState(50000);

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
//             console.log(err);
//         }
//     };

//     const getImg = (photo) => {
//         if (!photo) return "https://via.placeholder.com/150";
//         return `${BASE_URL}/uploads/${photo}`;
//     };

//     // ===== CREATE TEAM =====
//     const createTeam = async () => {
//         if (!teamName) return alert("Enter team name");

//         await fetch(`${BASE_URL}/api/teams`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 name: teamName,
//                 purse: Number(teamPurse),
//                 leagueId
//             })
//         });

//         setTeamName("");
//         loadData();
//     };

//     // ===== DELETE TEAM =====
//     const deleteTeam = async (id) => {
//         if (!window.confirm("Delete team?")) return;

//         await fetch(`${BASE_URL}/api/teams/${id}`, { method: "DELETE" });

//         setTeams(prev => prev.filter(t => t._id !== id));

//         if (selectedTeam?._id === id) {
//             setSelectedTeam(null);
//         }
//     };

//     // ===== SELL PLAYER =====
//     const sellPlayer = async () => {
//         if (!teamId) return alert("Select team");
//         if (!currentPlayer) return;

//         await fetch(`${BASE_URL}/api/teams/add-player`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 teamId,
//                 playerId: currentPlayer._id,
//                 price
//             })
//         });

//         alert("Player Sold ✅");

//         setCurrentPlayer(null);
//         setPrice(0);
//         setCustomBid("");
//         setTeamId("");

//         loadData();
//     };

//     // ===== UNSOLD =====
//     const unsoldPlayer = async (playerId, teamId) => {
//         await fetch(`${BASE_URL}/api/teams/remove-player`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ playerId, teamId })
//         });

//         alert("Player Unsold ✅");
//         loadData();
//     };

//     // ===== EXPORT EXCEL =====
//     const exportExcel = () => {
//         if (!selectedTeam) return;

//         const data = selectedTeam.players.map(p => ({
//             Name: p.playerId?.name,
//             Role: p.playerId?.role,
//             Price: p.price
//         }));

//         const ws = XLSX.utils.json_to_sheet(data);
//         const wb = XLSX.utils.book_new();

//         XLSX.utils.book_append_sheet(wb, ws, "Players");

//         const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });

//         saveAs(new Blob([buf]), `${selectedTeam.name}.xlsx`);
//     };

//     // ===== EXPORT PDF =====
//     const exportPDF = async () => {
//         try {
//             const element = document.getElementById("pdf-content");

//             if (!element) {
//                 alert("PDF content not found ❌");
//                 return;
//             }

//             // scroll to top before capture
//             window.scrollTo(0, 0);

//             const canvas = await html2canvas(element, {
//                 scale: 2,
//                 useCORS: true
//             });

//             const imgData = canvas.toDataURL("image/png");

//             const pdf = new jsPDF("p", "mm", "a4");

//             const pageWidth = 210;
//             const pageHeight = 295;

//             const imgWidth = pageWidth;
//             const imgHeight = (canvas.height * imgWidth) / canvas.width;

//             let heightLeft = imgHeight;
//             let position = 0;

//             pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;

//             while (heightLeft > 0) {
//                 position = heightLeft - imgHeight;
//                 pdf.addPage();
//                 pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
//                 heightLeft -= pageHeight;
//             }

//             pdf.save(`${selectedTeam.name}.pdf`);

//         } catch (err) {
//             console.log(err);
//             alert("PDF failed ❌");
//         }
//     };

//     return (
//         <div className="auction-page">

//             {/* TOP */}
//             <div className="top-bar">
//                 <input
//                     placeholder="Team Name"
//                     value={teamName}
//                     onChange={(e) => setTeamName(e.target.value)}
//                 />
//                 <input
//                     type="number"
//                     placeholder="Purse"
//                     value={teamPurse}
//                     onChange={(e) => setTeamPurse(e.target.value)}
//                 />
//                 <button onClick={createTeam}>Create Team</button>
//             </div>

//             {/* TEAM BAR */}
//             <div className="team-bar">
//                 {teams.map(t => (
//                     <div
//                         key={t._id}
//                         className={`team-pill ${selectedTeam?._id === t._id ? "active" : ""}`}
//                     >
//                         <span
//                             onClick={() => {
//                                 setSelectedTeam(t);
//                                 setCurrentPlayer(null);
//                             }}
//                         >
//                             {t.name} ₹{t.purse}
//                         </span>

//                         <span
//                             className="delete-btn"
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

//                 {/* LEFT */}
//                 <div className="left-panel">
//                     <h3>Unsold Players</h3>

//                     {players.filter(p => p.status !== "sold").map(p => (
//                         <div
//                             key={p._id}
//                             className="player-row"
//                             onClick={() => {
//                                 setCurrentPlayer(p);
//                                 setSelectedTeam(null);
//                                 setPrice(0);
//                             }}
//                         >
//                             <img src={getImg(p.photo)} alt="" />
//                             <div>
//                                 <b>{p.name}</b>
//                                 <p>{p.role}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* RIGHT */}
//                 <div className="right-panel">

//                     {selectedTeam ? (
//                         <div className="team-view">

//                             <div className="team-header">
//                                 <h2>{selectedTeam.name} Players</h2>

//                                 <div>
//                                     <button onClick={exportExcel}>Excel</button>
//                                     <button onClick={exportPDF}>PDF</button>
//                                 </div>
//                             </div>

//                             <div className="team-grid">
//                                 {selectedTeam.players?.map(p => (
//                                     <div key={p._id} className="team-card">

//                                         <img src={getImg(p.playerId?.photo)} />

//                                         <p>{p.playerId?.name}</p>
//                                         <p>₹{p.price}</p>

//                                         <button
//                                             onClick={() =>
//                                                 unsoldPlayer(p.playerId._id, selectedTeam._id)
//                                             }
//                                         >
//                                             Unsold
//                                         </button>

//                                     </div>
//                                 ))}
//                             </div>

//                         </div>

//                     ) : !currentPlayer ? (
//                         <h2>Select Player</h2>
//                     ) : (

//                         <div className="auction-card">

//                             <img src={getImg(currentPlayer.photo)} className="big-img" />

//                             <div className="details">

//                                 <h2>{currentPlayer.name}</h2>
//                                 <p>{currentPlayer.role}</p>

//                                 <h1>₹{price}</h1>

//                                 <div className="bid-row">
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
//                                             {t.name} (₹{t.purse})
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
// =========================================
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

    useEffect(() => {
        loadData();
    }, [leagueId]);

    const loadData = async () => {
        const p = await fetch(`${BASE_URL}/api/players/${leagueId}`);
        const t = await fetch(`${BASE_URL}/api/teams/with-players/${leagueId}`);

        setPlayers(await p.json());
        setTeams(await t.json());
    };

    const getImg = (photo) => {
        if (!photo) return "https://via.placeholder.com/150";
        return `${BASE_URL}/uploads/${photo}`;
    };

    // ================= CREATE TEAM =================
    const createTeam = async () => {
        if (!teamName) return;

        await fetch(`${BASE_URL}/api/teams`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: teamName,
                purse: teamPurse,
                leagueId
            })
        });

        setTeamName("");
        loadData();
    };

    // ================= DELETE TEAM =================
    const deleteTeam = async (id) => {
        await fetch(`${BASE_URL}/api/teams/${id}`, { method: "DELETE" });

        setTeams(prev => prev.filter(t => t._id !== id));

        if (selectedTeam?._id === id) setSelectedTeam(null);
    };

    // ================= SELL PLAYER =================
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
        setCustomBid("");
        loadData();
    };

    // ================= UNSOLD PLAYER =================
    const unsoldPlayer = async (playerId, teamId) => {
        try {
            await fetch(`${BASE_URL}/api/teams/remove-player`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ playerId, teamId })
            });

            alert("Player moved to Unsold ✅");

            loadData();
        } catch (err) {
            alert("Error ❌");
        }
    };

    // ================= EXPORT EXCEL =================
    const exportExcel = () => {
        const data = selectedTeam.players.map(p => ({
            Name: p.playerId?.name,
            Role: p.playerId?.role,
            Village: p.playerId?.village,
            Mobile: p.playerId?.mobile,
            Shirt: p.playerId?.shirtSize,
            Pant: p.playerId?.pantSize,
            Bid: p.price
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Players");

        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf]), `${selectedTeam.name}.xlsx`);
    };

    // ================= EXPORT PDF =================
    const exportPDF = async () => {
        const element = document.getElementById("pdf-content");

        const canvas = await html2canvas(element, {
            scale: 3,
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        pdf.save(`${selectedTeam.name}.pdf`);
    };

    return (
        <div className="auction-page">

            {/* ===== CREATE TEAM ===== */}
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

            {/* ===== TEAM TABS ===== */}
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

            {/* ===== MAIN ===== */}
            <div className="main-layout">

                {/* LEFT */}
                <div className="left-panel">
                    <h3>Unsold Players</h3>

                    {players.filter(p => p.status !== "sold").map(p => (
                        <div
                            key={p._id}
                            className="player-row"
                            onClick={() => {
                                setCurrentPlayer(p);
                                setSelectedTeam(null);
                            }}
                        >
                            <img src={getImg(p.photo)} />
                            <div>{p.name}</div>
                        </div>
                    ))}
                </div>

                {/* RIGHT */}
                <div className="right-panel">

                    {selectedTeam ? (
                        <div id="pdf-content">

                            <h2>{selectedTeam.name} Players</h2>

                            <button onClick={exportExcel}>Excel</button>
                            <button onClick={exportPDF}>PDF</button>

                            <div className="team-grid">
                                {selectedTeam.players?.map(p => (
                                    <div className="team-card" key={p._id}>

                                        <img src={getImg(p.playerId?.photo)} />

                                        <h3>{p.playerId?.name}</h3>
                                        <p>Village: {p.playerId?.village}</p>
                                        <p>Role: {p.playerId?.role}</p>
                                        <p>Mobile: {p.playerId?.mobile}</p>
                                        <p>Shirt: {p.playerId?.shirtSize}</p>
                                        <p>Pant: {p.playerId?.pantSize}</p>
                                        <p><b>Bid: ₹{p.price}</b></p>

                                        {/* 🔥 UNSOLD BUTTON */}
                                        <button
                                            className="unsold-btn"
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

                    ) : currentPlayer && (

                        <div className="auction-card">

                            <div className="card-left">
                                <img src={getImg(currentPlayer.photo)} />
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