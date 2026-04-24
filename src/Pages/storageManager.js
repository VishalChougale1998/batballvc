import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { get, set, initStorage } from "../utils/storageManager.js";

function Admin() {
    const navigate = useNavigate();

    const [players, setPlayers] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [teams, setTeams] = useState([]);

    const [activeLeague, setActiveLeague] = useState("");

    const [league, setLeague] = useState({
        name: "",
        city: "",
        slug: "",
        photo: ""
    });

    // LOAD DATA
    useEffect(() => {
        initStorage();

        const savedPlayers = get("players");
        const savedLeagues = get("leagues");
        const savedTeams = get("teams");

        setPlayers(savedPlayers);
        setLeagues(savedLeagues);
        setTeams(savedTeams);

        if (savedLeagues.length > 0) {
            setActiveLeague(savedLeagues[0].slug);
        }
    }, []);

    // CREATE LEAGUE
    const handleSubmit = () => {
        if (!league.name || !league.slug) {
            return alert("Fill all fields");
        }

        const updated = [...leagues, league];

        set("leagues", updated);
        setLeagues(updated);
        setActiveLeague(league.slug);

        // ✅ FIX: reset including photo
        setLeague({
            name: "",
            city: "",
            slug: "",
            photo: ""
        });
    };

    // DELETE PLAYER
    const deletePlayer = (id) => {
        const updated = players.filter(p => p.id !== id);
        set("players", updated);
        setPlayers(updated);
    };

    // DELETE LEAGUE
    const deleteLeague = (slug) => {
        const updated = leagues.filter(l => l.slug !== slug);

        set("leagues", updated);
        setLeagues(updated);

        if (activeLeague === slug) {
            setActiveLeague("");
        }
    };

    // FILTER PLAYERS
    const leaguePlayers = players.filter(
        p => p.leagueId === activeLeague && p.status !== "sold"
    );

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

                <input
                    placeholder="League Name"
                    value={league.name}
                    onChange={(e) =>
                        setLeague({ ...league, name: e.target.value })
                    }
                />

                <input
                    placeholder="City"
                    value={league.city}
                    onChange={(e) =>
                        setLeague({ ...league, city: e.target.value })
                    }
                />

                <input
                    placeholder="Slug"
                    value={league.slug}
                    onChange={(e) =>
                        setLeague({ ...league, slug: e.target.value })
                    }
                />

                {/* IMAGE UPLOAD */}
                <div className="image-upload">
                    <label>Upload Tournament Banner</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setLeague({
                                    ...league,
                                    photo: reader.result
                                });
                            };
                            reader.readAsDataURL(file);
                        }}
                    />

                    {league.photo && (
                        <img
                            src={league.photo}
                            alt="preview"
                            className="league-preview"
                        />
                    )}
                </div>

                <button className="primary-btn" onClick={handleSubmit}>
                    Create League
                </button>
            </div>

            {/* LEAGUE TABS */}
            <div className="league-tabs">
                {leagues.map((lg) => (
                    <div key={lg.slug} className="league-tab-wrapper">

                        <button
                            className={`league-tab ${activeLeague === lg.slug ? "active" : ""
                                }`}
                            onClick={() => setActiveLeague(lg.slug)}
                        >
                            {lg.name}
                        </button>

                        <button
                            className="auction-btn"
                            onClick={() =>
                                navigate(`/auction/${lg.slug}`)
                            }
                        >
                            Auction
                        </button>

                        <span
                            className="delete-x"
                            onClick={() => deleteLeague(lg.slug)}
                        >
                            ×
                        </span>
                    </div>
                ))}
            </div>

            {/* PLAYERS TABLE */}
            <div className="players-table">

                <div className="table-header">
                    <div>Photo</div>
                    <div>Name</div>
                    <div>Village</div>
                    <div>Role</div>
                    <div>Action</div>
                </div>

                {leaguePlayers.map((p) => (
                    <div className="player-row" key={p.id}>

                        <div className="col photo">
                            <img
                                src={p.photo || "default.png"}
                                alt="Player"
                                className="player-photo"
                            />
                        </div>

                        <div className="col">{p.name}</div>
                        <div className="col">{p.village || "-"}</div>

                        <div className="col">
                            <span className="role">{p.role}</span>
                        </div>

                        <div className="col actions">
                            <button
                                onClick={() =>
                                    navigate(`/auction/${activeLeague}`)
                                }
                            >
                                Select
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() => deletePlayer(p.id)}
                            >
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