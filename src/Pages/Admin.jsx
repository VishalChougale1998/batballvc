import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import BASE_URL from "../api";

function Admin() {
    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [activeLeague, setActiveLeague] = useState("");

    const [league, setLeague] = useState({
        name: "",
        village: "",
        playerLimit: "",
        entryFee: "",
        lastDate: "",
        slug: "",
        banner: null
    });

    // ================= LOAD =================

    useEffect(() => {
        loadLeagues();
    }, []);

    useEffect(() => {
        if (activeLeague) {
            loadPlayers(activeLeague);
        }
    }, [activeLeague]);

    const loadLeagues = async () => {
        const res = await fetch(`${BASE_URL}/api/leagues`);
        const data = await res.json();

        setLeagues(data);

        if (data.length > 0 && !activeLeague) {
            setActiveLeague(data[0]._id);
        }
    };

    const loadPlayers = async (leagueId) => {
        const res = await fetch(`${BASE_URL}/api/players/${leagueId}`);
        const data = await res.json();
        setPlayers(data);
    };

    // ================= CREATE LEAGUE =================

    const handleSubmit = async () => {
        if (!league.name || !league.village) {
            return alert("Fill all fields");
        }

        const formData = new FormData();

        formData.append("name", league.name);
        formData.append("village", league.village);
        formData.append("playerLimit", league.playerLimit);
        formData.append("entryFee", league.entryFee);
        formData.append("lastDate", league.lastDate);
        formData.append("slug", league.slug);
        formData.append("banner", league.banner);

        await fetch(`${BASE_URL}/api/create-league`, {
            method: "POST",
            body: formData
        });

        alert("League Created ✅");

        setLeague({
            name: "",
            village: "",
            playerLimit: "",
            entryFee: "",
            lastDate: "",
            slug: "",
            banner: null
        });

        loadLeagues();
    };

    // ================= DELETE LEAGUE =================

    const deleteLeague = async (id) => {
        if (!window.confirm("Delete league?")) return;

        await fetch(`${BASE_URL}/api/leagues/${id}`, {
            method: "DELETE"
        });

        loadLeagues();
    };

    // ================= DELETE PLAYER =================

    const deletePlayer = async (id) => {
        await fetch(`${BASE_URL}/api/players/${id}`, {
            method: "DELETE"
        });

        loadPlayers(activeLeague);
    };

    return (
        <div className="admin-container">

            {/* TOP BAR */}
            <div className="top-bar">
                <button className="logout-btn" onClick={() => navigate("/")}>
                    Logout
                </button>
            </div>

            {/* CREATE LEAGUE */}
            <div className="admin-card">
                <h3>Create League</h3>

                <input placeholder="League Name"
                    value={league.name}
                    onChange={(e) => setLeague({ ...league, name: e.target.value })} />

                <input placeholder="Village"
                    value={league.village}
                    onChange={(e) => setLeague({ ...league, village: e.target.value })} />

                <input placeholder="Max Players"
                    value={league.playerLimit}
                    onChange={(e) => setLeague({ ...league, playerLimit: e.target.value })} />

                <input placeholder="Entry Fee"
                    value={league.entryFee}
                    onChange={(e) => setLeague({ ...league, entryFee: e.target.value })} />

                <input type="date"
                    value={league.lastDate}
                    onChange={(e) => setLeague({ ...league, lastDate: e.target.value })} />

                <input placeholder="Slug"
                    value={league.slug}
                    onChange={(e) => setLeague({ ...league, slug: e.target.value })} />

                <input type="file"
                    onChange={(e) => setLeague({ ...league, banner: e.target.files[0] })} />

                <button className="primary-btns" onClick={handleSubmit}>
                    Create League
                </button>
            </div>

            {/* LEAGUE TABS */}
            <div className="league-tabs">
                {leagues.map((lg) => (
                    <div key={lg._id} className="league-tab-wrapper">

                        <button
                            className={`league-tab ${activeLeague === lg._id ? "active" : ""}`}
                            onClick={() => setActiveLeague(lg._id)}
                        >
                            {lg.name}
                        </button>

                        <button
                            className="auction-btn"
                            onClick={() => navigate(`/auction/${lg._id}`)}
                        >
                            Auction
                        </button>

                        <span
                            className="delete-x"
                            onClick={() => deleteLeague(lg._id)}
                        >
                            ×
                        </span>

                    </div>
                ))}
            </div>

            {/* PLAYERS */}
            <div className="players-table">

                <div className="table-header">
                    <div>Photo</div>
                    <div>Name</div>
                    <div>Village</div>
                    <div>Role</div>
                    <div>Action</div>
                </div>

                {players.map(p => (
                    <div className="player-row" key={p._id}>

                        <div className="col">
                            <img
                                src={p.photo ? `${BASE_URL}/uploads/${p.photo}` : "https://via.placeholder.com/60"}
                                style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                            />
                        </div>

                        <div className="col">{p.name}</div>
                        <div className="col">{p.village}</div>
                        <div className="col">{p.role}</div>

                        <div className="col">
                            <button className="green-round" onClick={() => navigate(`/auction/${activeLeague}`)}>
                                Auction
                            </button>

                            <button className="delete-round" onClick={() => deletePlayer(p._id)}>
                                Delete
                            </button>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}

export default Admin;