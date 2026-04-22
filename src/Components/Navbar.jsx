import { Link } from "react-router-dom";
// import logo from "../Media/logo.jpeg";


function Navbar() {

    return (
        <div
            style={{
                width: "100%",
                background: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)",
                // background: "linear-gradient(90deg, pink, #22cd44, #4da8cf)",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 40px",
                boxSizing: "border-box",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1000
            }}
        >
            {/* <h2 style={{ margin: 0 }}>BatBallVc 🏏</h2> */}
            {/* <img src={logo} alt="Logo" style={{ height: "80px" }} /> */}
            <img src="/logo.jpeg" alt="logo" style={{ height: "80px" }} />

            <div style={{ display: "flex", gap: "20px" }}>
                <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                    Home
                </Link>

                <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
                    Admin Login
                </Link>
            </div>
        </div>
    );
}

export default Navbar;