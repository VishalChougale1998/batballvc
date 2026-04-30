import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const BASE_URL = "https://batballvc-backend.onrender.com";

const getImage = (img) => {
    if (!img) return "/default.png";
    if (img.startsWith("http")) return img;
    return `${BASE_URL}/uploads/${img}`;
};

function FixedAdmin() {
    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [activeLeague, setActiveLeague] = useState("");
    const [bannerFile, setBannerFile] = useState(null);

    const [league, setLeague] = useState({
        name: "",
        city: "",
        fee: "",
        lastDate: "",
        slug: "",
    });

    useEffect(() => {
        fetchLeagues();
    }, []);

    const fetchLeagues = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/leagues`);
            const data = await res.json();
            setLeagues(data || []);
        } catch (err) {
            console.error("Fetch leagues error:", err);
        }
    };

    // ✅ FIXED
    const fetchPlayers = async (leagueId) => {
        if (!leagueId) {
            console.error("❌ Invalid leagueId:", leagueId);
            return;
        }

        try {
            console.log("Fetching players for:", leagueId);

            const res = await fetch(`${BASE_URL}/api/players-all/${leagueId}`);

            if (!res.ok) {
                throw new Error("API failed");
            }

            const data = await res.json();

            setPlayers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch players error:", err);
            setPlayers([]);
        }
    };

    const handleChange = (e) => {
        setLeague({
            ...league,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageUpload = (e) => {
        setBannerFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!league.name) return alert("Enter league name");

        try {
            const formData = new FormData();

            formData.append("name", league.name);
            formData.append("village", league.city || "");
            formData.append("entryFee", league.fee || 0);
            formData.append("lastDate", league.lastDate || "");
            formData.append("slug", league.slug || "");

            if (bannerFile) {
                formData.append("banner", bannerFile);
            }

            const res = await fetch(`${BASE_URL}/api/create-league`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("SERVER ERROR:", data);
                alert(data.msg || "Failed to create league ❌");
                return;
            }

            alert("League Created ✅");
            fetchLeagues();

            setLeague({
                name: "",
                city: "",
                fee: "",
                lastDate: "",
                slug: "",
            });

            setBannerFile(null);

        } catch (err) {
            console.error("CREATE ERROR:", err);
            alert("Error creating league ❌");
        }
    };

    const handleDeleteLeague = async (id) => {
        if (!window.confirm("Delete this league?")) return;

        try {
            await fetch(`${BASE_URL}/api/leagues/${id}`, {
                method: "DELETE",
            });

            fetchLeagues();
            setActiveLeague("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePlayer = async (id) => {
        if (!window.confirm("Delete player?")) return;

        try {
            await fetch(`${BASE_URL}/api/players/${id}`, {
                method: "DELETE",
            });

            fetchPlayers(activeLeague);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectLeague = (lg) => {
        setActiveLeague(lg._id);
        fetchPlayers(lg._id);
    };

    const handleLogout = () => {
        localStorage.removeItem("adminLoggedIn");
        navigate("/");
    };

    // ✅ FIXED EXPORT API
    const exportLeaguePlayers = async () => {
        if (!activeLeague) {
            alert("Select a league first");
            return;
        }

        try {
            const res = await fetch(
                `${BASE_URL}/api/players-all/${activeLeague}`
            );

            if (!res.ok) {
                alert("API error");
                return;
            }

            const data = await res.json();

            if (!data || data.length === 0) {
                alert("No players found");
                return;
            }

            const formatted = data.map((p) => ({
                Name: p.name,
                Village: p.village,
                Role: p.role,
                Mobile: p.mobile,
                Shirt: p.tshirtSize,
                Pant: p.pantSize,
                Team: p.teamId?.name || "Unsold",
                Bid: p.price || 0,
                Status: p.status,
                Photo: p.photo || "",
            }));

            const worksheet = XLSX.utils.json_to_sheet(formatted);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Players");

            const fileBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });

            const blob = new Blob([fileBuffer], {
                type: "application/octet-stream",
            });

            saveAs(blob, "League_Players.xlsx");

        } catch (err) {
            console.error(err);
            alert("Export failed");
        }
    };

    return (
        <div className="hero-section admin-container">

            <div className="admin-card">
                <h3>Create League</h3>

                <form onSubmit={handleSubmit}>
                    <input name="name" placeholder="League Name" value={league.name} onChange={handleChange} />
                    <input name="city" placeholder="Village" value={league.city} onChange={handleChange} />
                    <input name="fee" placeholder="Entry Fee" value={league.fee} onChange={handleChange} />
                    <input name="lastDate" type="date" value={league.lastDate} onChange={handleChange} />
                    <input name="slug" placeholder="League Code" value={league.slug} onChange={handleChange} />

                    <input type="file" onChange={handleImageUpload} />

                    <button>Create League</button>
                </form>
            </div>

            <div className="players-section">
                <h3>Leagues</h3>

                {leagues.length === 0 && <p>No leagues found</p>}

                <div className="league-tabs">
                    {leagues.map((lg) => (
                        <div key={lg._id} className="league-tab-wrapper">

                            <button
                                className={`league-tab ${activeLeague === lg._id ? "active-tab" : ""}`}
                                onClick={() => handleSelectLeague(lg)}
                            >
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <img
                                        src={getImage(lg.banner)}
                                        onError={(e) => (e.target.src = "/default.png")}
                                        style={{ width: 28, height: 28, borderRadius: "50%" }}
                                        alt="league"
                                    />
                                    {lg.name}
                                </div>
                            </button>

                            <button onClick={() => navigate(`/auction/${lg._id}`)}>
                                Auction
                            </button>

                            <button onClick={() => handleDeleteLeague(lg._id)}>
                                ×
                            </button>

                        </div>
                    ))}
                </div>

                <button onClick={exportLeaguePlayers} className="create-btn">
                    Export League Players
                </button>

                {activeLeague && (
                    <div className="players-table">

                        {players.length === 0 ? (
                            <p>No players</p>
                        ) : (
                            players.map((p) => (
                                <div key={p._id} className="player-row">

                                    <img
                                        src={getImage(p.photo)}
                                        onError={(e) => (e.target.src = "/default.png")}
                                        className="player-image"
                                        alt="player"
                                    />

                                    <div>{p.name}</div>
                                    <div>{p.village}</div>
                                    <div>{p.role}</div>

                                    <button onClick={() => handleDeletePlayer(p._id)}>
                                        Delete
                                    </button>

                                </div>
                            ))
                        )}

                    </div>
                )}
            </div>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default FixedAdmin;