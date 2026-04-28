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
        if (!photo) return `${window.location.origin}/default.jpg`;

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
                                    onError={(e) => {
                                        e.target.src = `${window.location.origin}/default.jpg`;
                                    }}
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
                                            onError={(e) => {
                                                e.target.src = `${window.location.origin}/default.jpg`;
                                            }}
                                            alt=""
                                        />

                                        <h3>{p.playerId?.name || "-"}</h3>
                                        <p>{p.playerId?.role || "-"}</p>
                                        <p>₹{Number(p.price || 0).toLocaleString()}</p>

                                        <button onClick={() =>
                                            unsoldPlayer(p.playerId?._id, selectedTeam?._id)
                                        }>
                                            Unsold
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
                                    onError={(e) => {
                                        e.target.src = `${window.location.origin}/default.jpg`;
                                    }}
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
                                {/* manualinput */}


                                <input
                                    type="number"
                                    placeholder="Enter manual bid"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value) || 0)}
                                />

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
// ==============================================================
