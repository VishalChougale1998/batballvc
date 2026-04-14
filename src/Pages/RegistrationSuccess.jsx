import { useParams } from "react-router-dom";

function RegistrationSuccess() {

    const { leagueId } = useParams();

    return (
        <div className="hero-section" style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white"
        }}>

            <div style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                padding: "50px",
                borderRadius: "12px",
                textAlign: "center",
                width: "500px"
            }}>

                <h1 style={{ color: "blue" }}>Registration Successful 🎉</h1>

                <p>
                    Your registration for league <b>{leagueId}</b> is completed.
                </p>

                <p>
                    Our team will contact you soon.
                </p>

                <button
                    className="btn btn-warning mt-3"
                    onClick={() => window.location.href = "/"}
                >
                    Go Home
                </button>

            </div>

        </div>
    );
}

export default RegistrationSuccess;