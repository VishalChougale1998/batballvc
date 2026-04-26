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

    useEffect(() => {
        loadData();
    }, [leagueId]);

    /* ================= SAFE LOAD ================= */
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
            console.error("LOAD ERROR:", err);
            setPlayers([]);
            setTeams([]);
        } finally {
            setLoading(false);
        }
    };

    /* ================= IMAGE ================= */
    const getImg = (photo) => {
        if (!photo) return "/default.jpg";
        if (photo.startsWith("http")) return photo;
        if (photo.startsWith("uploads/")) return `${BASE_URL}/${photo}`;
        return `${BASE_URL}/uploads/${photo}`;
    };

    /* ================= TEAM ================= */
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

    /* ================= PLAYER ================= */
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

    /* ================= PDF (PREMIUM CARD) ================= */
    const downloadPDF = async () => {
        if (!selectedTeam) return alert("Select team first");

        const pdf = new jsPDF();

        // 🔹 convert image → base64
        const getBase64 = async (url) => {
            try {
                const res = await fetch(url);
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

        // 🔹 clean text (fix weird symbols issue)
        const clean = (val) => {
            if (!val) return "-";
            return String(val).replace(/[^\w\s₹.-]/g, "");
        };

        // 🔹 format price properly
        const formatPrice = (val) => {
            const num = Number(val);
            if (isNaN(num)) return "₹ 0";
            return `₹ ${num.toLocaleString("en-IN")}`;
        };

        // 🔹 HEADER
        pdf.setFontSize(18);
        pdf.text(clean(selectedTeam.name), 105, 15, { align: "center" });

        let x = 10;
        let y = 30;

        const cardWidth = 90;
        const cardHeight = 55;
        const gap = 10;

        for (let p of selectedTeam.players || []) {
            const player = p.playerId;
            if (!player) continue;

            // 🟦 CARD
            pdf.rect(x, y, cardWidth, cardHeight);

            // 🖼 IMAGE
            const img = await getBase64(getImg(player.photo));
            if (img) {
                const format = img.includes("png") ? "PNG" : "JPEG";
                pdf.addImage(img, format, x + 3, y + 5, 20, 20);
            }

            // 🧑 TEXT
            pdf.setFontSize(10);
            pdf.setFont(undefined, "bold");
            pdf.text(clean(player.name), x + 28, y + 10);

            pdf.setFont(undefined, "normal");
            pdf.text(clean(player.role), x + 28, y + 16);
            pdf.text(clean(player.village), x + 28, y + 22);

            pdf.text(`Shirt: ${clean(player.tshirtSize)}`, x + 5, y + 35);
            pdf.text(`Pant: ${clean(player.pantSize)}`, x + 45, y + 35);

            // 💰 PRICE (FIXED)
            pdf.setFont(undefined, "bold");
            pdf.text(formatPrice(p.price), x + 5, y + 45);

            // ➡️ NEXT POSITION
            x += cardWidth + gap;

            if (x + cardWidth > 200) {
                x = 10;
                y += cardHeight + gap;
            }

            // ➕ NEW PAGE (IMPORTANT FIX)
            if (y + cardHeight > 280) {
                pdf.addPage();
                x = 10;
                y = 20;
            }
        }

        pdf.save(`${clean(selectedTeam.name)}.pdf`);
    };

    /* ================= EXCEL ================= */
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

    /* ================= UI ================= */
    return (
        <div className="auction-page">

            <div className="top-bar">
                <input value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                <input type="number" value={teamPurse} onChange={(e) => setTeamPurse(e.target.value)} />
                <button onClick={createTeam}>Create</button>
            </div>

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

                <div className="left-panel">
                    <h3>Unsold Players</h3>
                    {loading && <p>Loading...</p>}

                    {Array.isArray(players) &&
                        players.filter(p => p.status !== "sold").map(p => (
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

                <div className="right-panel">

                    {selectedTeam && (
                        <>
                            <button onClick={downloadPDF}>PDF</button>
                            <button onClick={downloadExcel}>Excel</button>

                            <div className="team-grid">
                                {selectedTeam.players?.map(p => (
                                    <div className="team-card" key={p._id}>
                                        <img src={getImg(p.playerId?.photo)} alt="" />
                                        <h3>{p.playerId?.name || "-"}</h3>
                                        <p>{p.playerId?.role || "-"}</p>
                                        <p>₹{p.price}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {!selectedTeam && currentPlayer && (
                        <div className="auction-card">

                            {/* LEFT - IMAGE */}
                            <div className="card-left">
                                <img
                                    src={getImg(currentPlayer.photo)}
                                    alt=""
                                    onError={(e) => e.target.src = "/default.jpg"}
                                />
                            </div>

                            {/* RIGHT - DETAILS */}
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
                                    <option>Select Team</option>
                                    {teams.map(t => (
                                        <option key={t._id} value={t._id}>{t.name}</option>
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