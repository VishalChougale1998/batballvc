import { useEffect, useState } from "react";
import BASE_URL from "../api";
import { Link } from "react-router-dom";
import "./RegisterPlayer.css";

function Leagues() {
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/api/leagues`)
            .then(res => res.json())
            .then(data => setLeagues(data))
            .catch(err => console.error("Error fetching leagues:", err));
    }, []);

    return (
        <div className="view-container">

            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                🏏 Leagues
            </h2>

            <div className="leagues-container">

                {leagues.map((l) => (
                    <div className="league-card" key={l._id}>

                        {/* IMAGE */}
                        <img
                            src={`${BASE_URL}/${l.image}`}
                            alt="league"
                            className="league-img"
                        />

                        {/* CONTENT */}
                        <div className="league-content">

                            <h4>{l.name}</h4>

                            <p>📍 {l.village}</p>
                            <p>💰 Fee: ₹{l.entryFee}</p>
                            <p>📅 {l.lastDate}</p>

                            {/* REGISTER */}
                            <Link to={`/register/${l._id}`}>
                                <button className="league-btn">
                                    Register
                                </button>
                            </Link>

                            {/* AUCTION */}
                            <Link to={`/auction/${l._id}`}>
                                <button
                                    className="league-btn"
                                    style={{
                                        background: "#3b82f6",
                                        color: "white"
                                    }}
                                >
                                    Auction
                                </button>
                            </Link>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default Leagues;