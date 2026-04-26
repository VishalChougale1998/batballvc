import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";


function Home() {
    const navigate = useNavigate();

    // ✅ Use images from PUBLIC folder (IMPORTANT)
    // const images = [raje, logo, rs];
    const images = [
        "/csm.jpg",
        "/logo.jpeg",
        "/rs.jpg"
    ];

    const [index, setIndex] = useState(0);

    // 🔥 Auto change background every 3 sec
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="home-container"
            style={{
                backgroundImage: `url(${images[index]})`
            }}
        >

            {/* DARK OVERLAY */}
            <div className="home-overlay"></div>

            {/* CONTENT */}
            <div className="home-content">

                <h1 className="home-title">BatBall VC App</h1>

                <p className="home-subtitle">
                    Join your local cricket tournaments
                </p>

                <div className="home-buttons">

                    <button
                        className="btn-primary"
                        onClick={() => navigate("/register-leagues")}
                    >
                        Register Player
                    </button>

                    <button
                        className="btn-secondary"
                        onClick={() => navigate("/view-leagues")}
                    >
                        View Leagues
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Home;