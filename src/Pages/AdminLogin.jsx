import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === "VishalAppa" && password === "Batballvc@2026") {
            navigate("/admin-panel");
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(135deg, #000000, #434343)"
        }}>

            <div style={{
                background: "#fff",
                padding: "40px",
                color: "#333",
                borderRadius: "12px",
                width: "300px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            }}>

                <h2 style={{ marginBottom: "20px", color: "#333" }}>Admin Login</h2>

                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                />

                <button onClick={handleLogin} style={buttonStyle}>
                    Login
                </button>

            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc"
};

const buttonStyle = {
    width: "100%",
    padding: "10px",
    background: "#ffc107",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
};

export default AdminLogin;