import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:5000";

function FixedAdmin() {
    const navigate = useNavigate();

    // ================= STATES =================
    const [players, setPlayers] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [activeLeague, setActiveLeague] = useState("");
    const [bannerFile, setBannerFile] = useState(null);

    const [league, setLeague] = useState({
        name: "",
        city: "",
        fee: "",
        limit: "",
        lastDate: "",
        slug: ""
    });

    const [registrationLink, setRegistrationLink] = useState("");

    // ================= FETCH DATA =================
    useEffect(() => {
        fetchLeagues();
    }, []);

    const fetchLeagues = async () => {
        const res = await fetch(`${BASE_URL}/api/leagues`);
        const data = await res.json();
        setLeagues(data);
    };

    const fetchPlayers = async (leagueId) => {
        const res = await fetch(`${BASE_URL}/api/players/${leagueId}`);
        const data = await res.json();
        setPlayers(data);
    };

    // ================= INPUT =================
    const handleChange = (e) => {
        setLeague({
            ...league,
            [e.target.name]: e.target.value
        });
    };

    // ================= IMAGE UPLOAD =================
    const handleImageUpload = (e) => {
        setBannerFile(e.target.files[0]);
    };

    // ================= CREATE LEAGUE =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!league.name) return alert("Enter league name");

        try {
            const formData = new FormData();

            formData.append("name", league.name);
            formData.append("village", league.city);
            formData.append("entryFee", league.fee);
            formData.append("playerLimit", league.limit);
            formData.append("lastDate", league.lastDate);
            formData.append("slug", league.slug);

            if (bannerFile) {
                formData.append("banner", bannerFile);
            }

            await fetch(`${BASE_URL}/api/create-league`, {
                method: "POST",
                body: formData
            });

            alert("League Created ✅");
            fetchLeagues();

            setLeague({
                name: "",
                city: "",
                fee: "",
                limit: "",
                lastDate: "",
                slug: ""
            });

            setBannerFile(null);

        } catch (err) {
            alert("Failed to create league ❌");
        }
    };

    // ================= DELETE LEAGUE =================
    const handleDeleteLeague = async (id) => {
        if (!window.confirm("Delete this league?")) return;

        await fetch(`${BASE_URL}/api/leagues/${id}`, {
            method: "DELETE"
        });

        fetchLeagues();
        setActiveLeague("");
    };

    // ================= DELETE PLAYER =================
    const handleDeletePlayer = async (id) => {
        if (!window.confirm("Delete player?")) return;

        await fetch(`${BASE_URL}/api/players/${id}`, {
            method: "DELETE"
        });

        fetchPlayers(activeLeague);
    };

    // ================= SELECT LEAGUE =================
    const handleSelectLeague = (lg) => {
        setActiveLeague(lg._id);
        fetchPlayers(lg._id);
    };

    // ================= LOGOUT =================
    const handleLogout = () => {
        localStorage.removeItem("adminLoggedIn");
        navigate("/");
    };

    return (
        <div className="hero-section admin-container">

            {/* ================= CREATE LEAGUE ================= */}
            <div className="admin-card">
                <h3>Create League</h3>

                <form onSubmit={handleSubmit}>
                    <input className="admin-input" name="name" placeholder="League Name" value={league.name} onChange={handleChange} />
                    <input className="admin-input" name="city" placeholder="Village" value={league.city} onChange={handleChange} />
                    <input className="admin-input" name="fee" placeholder="Entry Fee" value={league.fee} onChange={handleChange} />
                    <input className="admin-input" name="limit" placeholder="Player Limit" value={league.limit} onChange={handleChange} />
                    <input className="admin-input" name="lastDate" type="date" value={league.lastDate} onChange={handleChange} />
                    <input className="admin-input" name="slug" placeholder="League Code" value={league.slug} onChange={handleChange} />

                    <input type="file" onChange={handleImageUpload} />

                    <button className="admin-button">Create League</button>
                </form>
            </div>

            {/* ================= LEAGUES ================= */}
            <div className="players-section">

                <h3>Leagues</h3>

                <div className="league-tabs">
                    {leagues.map((lg) => (
                        <div key={lg._id} className="league-tab-wrapper">

                            <button
                                className={`league-tab ${activeLeague === lg._id ? "active-tab" : ""}`}
                                onClick={() => handleSelectLeague(lg)}
                            >
                                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    {lg.banner && (
                                        <img
                                            src={`${BASE_URL}/uploads/${lg.banner}`}
                                            style={{ width: 28, height: 28, borderRadius: "50%" }}
                                        />
                                    )}
                                    {lg.name}
                                </div>
                            </button>

                            <button
                                className="auction-btn"
                                onClick={() => navigate(`/auction/${lg._id}`)}
                            >
                                Auction
                            </button>

                            <button
                                className="delete-league-btn"
                                onClick={() => handleDeleteLeague(lg._id)}
                            >
                                ×
                            </button>

                        </div>
                    ))}
                </div>

                {/* ================= PLAYERS ================= */}
                {activeLeague && (
                    <div className="players-table">

                        <div className="table-header">
                            <span>Photo</span>
                            <span>Name</span>
                            <span>Village</span>
                            <span>Role</span>
                            <span>Action</span>
                        </div>

                        {players.length === 0 ? (
                            <p>No players</p>
                        ) : (
                            players.map((p) => (
                                <div key={p._id} className="player-row">

                                    <div>
                                        {p.photo && (
                                            <img
                                                className="player-image"
                                                src={`${BASE_URL}/uploads/${p.photo}`}
                                            />
                                        )}
                                    </div>

                                    <div>{p.name}</div>
                                    <div>{p.village}</div>
                                    <div>{p.role}</div>

                                    <div>
                                        <button
                                            className="delete-player-btn"
                                            onClick={() => handleDeletePlayer(p._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>

                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* ================= LOGOUT ================= */}
            <div className="admin-footer">
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </div>

        </div>
    );
}

export default FixedAdmin;