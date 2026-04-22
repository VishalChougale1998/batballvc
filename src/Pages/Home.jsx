// // // import { useEffect, useState } from "react";
// // // import { useNavigate } from "react-router-dom";

// // // function Home() {

// // //     const navigate = useNavigate();

// // //     const images = [
// // //         "/src/Media/sm.jpg",
// // //         "/src/Media/logo.jpeg",
// // //         "/src/Media/rs.jpg"
// // //     ];

// // //     const [index, setIndex] = useState(0);

// // //     useEffect(() => {
// // //         const interval = setInterval(() => {
// // //             setIndex((prev) => (prev + 1) % images.length);
// // //         }, 3000);
// // //         return () => clearInterval(interval);
// // //     }, []);

// // //     return (
// // //         <div style={{ height: "100vh", position: "relative" }}>

// // //             <div style={{
// // //                 position: "absolute",
// // //                 width: "100%",
// // //                 height: "100%",
// // //                 backgroundImage: `url(${images[index]})`,
// // //                 backgroundSize: "cover",
// // //                 transition: "1s"
// // //             }} />

// // //             <div style={{
// // //                 position: "absolute",
// // //                 width: "100%",
// // //                 height: "100%",
// // //                 background: "rgba(0,0,0,0.6)",
// // //                 display: "flex",
// // //                 flexDirection: "column",
// // //                 justifyContent: "center",
// // //                 alignItems: "center",
// // //                 color: "white"
// // //             }}>

// // //                 <h1>BatBallVc</h1>

// // //                 <button
// // //                     className="home-btn primary"
// // //                     onClick={() => navigate("/register-leagues")}
// // //                     style={{ margin: '10px' }}
// // //                 >
// // //                     Register as Player
// // //                 </button>

// // //                 <button
// // //                     className="home-btn secondary"
// // //                     onClick={() => navigate("/view-leagues")}
// // //                     style={{ margin: '10px' }}
// // //                 >
// // //                     View Leagues
// // //                 </button>



// // //             </div>

// // //         </div>
// // //     );
// // // }

// // // export default Home;

// // import { useNavigate } from "react-router-dom";
// // import { useState, useEffect } from "react";

// // function Home() {
// //     const navigate = useNavigate();

// //     // 🔥 YOUR IMAGES (you can change later)
// //     const images = [
// //         "/src/Media/sm.jpg",
// //         "/src/Media/logo.jpeg",
// //         "/src/Media/rs.jpg"
// //     ];

// //     const [index, setIndex] = useState(0);

// //     // 🔥 AUTO CHANGE EVERY 3 SEC
// //     useEffect(() => {
// //         const interval = setInterval(() => {
// //             setIndex((prev) => (prev + 1) % images.length);
// //         }, 3000);

// //         return () => clearInterval(interval);
// //     }, []);

// //     return (
// //         <div
// //             style={{
// //                 height: "100vh",
// //                 backgroundImage: `url(${images[index]})`,
// //                 backgroundSize: "cover",
// //                 backgroundPosition: "center",
// //                 transition: "1s ease-in-out",
// //                 display: "flex",
// //                 flexDirection: "column",
// //                 justifyContent: "center",
// //                 alignItems: "center",
// //                 color: "white",
// //                 textAlign: "center"
// //             }}
// //         >

// //             {/* 🔥 DARK OVERLAY */}
// //             <div style={{
// //                 position: "absolute",
// //                 top: 0,
// //                 left: 0,
// //                 width: "100%",
// //                 height: "100%",
// //                 background: "rgba(0,0,0,0.6)"
// //             }} />

// //             {/* 🔥 CONTENT */}
// //             <div style={{ position: "relative", zIndex: 2 }}>

// //                 <h1 style={{
// //                     fontSize: "50px",
// //                     fontWeight: "bold",
// //                     color: "#ffc107"
// //                 }}>
// //                     BatBall VC
// //                 </h1>

// //                 <p style={{ fontSize: "18px" }}>
// //                     Join your local cricket tournaments
// //                 </p>

// //                 <div style={{ marginTop: "30px" }}>

// //                     <button
// //                         onClick={() => navigate("/register-leagues")}
// //                         style={{
// //                             background: "#ffc107",
// //                             color: "black",
// //                             padding: "12px 30px",
// //                             margin: "10px",
// //                             border: "none",
// //                             borderRadius: "8px",
// //                             fontWeight: "bold"
// //                         }}
// //                     >
// //                         Register Player
// //                     </button>

// //                     <button
// //                         onClick={() => navigate("/view-leagues")}
// //                         style={{
// //                             background: "#0d6efd",
// //                             color: "white",
// //                             padding: "12px 30px",
// //                             margin: "10px",
// //                             border: "none",
// //                             borderRadius: "8px",
// //                             fontWeight: "bold"
// //                         }}
// //                     >
// //                         View Leagues
// //                     </button>

// //                 </div>

// //             </div>

// //         </div>
// //     );
// // }

// // export default Home;


// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "../App.css";

// function Home() {
//     const navigate = useNavigate();

//     const images = [
//         "/src/Media/sm.jpg",
//         "/src/Media/logo.jpeg",
//         "/src/Media/rs.jpg"
//     ];

//     const [index, setIndex] = useState(0);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setIndex((prev) => (prev + 1) % images.length);
//         }, 3000);

//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <div
//             className="home-container"
//             style={{ backgroundImage: "url(/sm.jpg)" }}
//         >

//             {/* Overlay */}
//             <div className="home-overlay" />

//             {/* Content */}
//             <div className="home-content">

//                 <h1 className="home-title">BatBall VC</h1>

//                 <p className="home-subtitle">
//                     Join your local cricket tournaments
//                 </p>

//                 <div className="home-buttons">

//                     <button
//                         className="btn-primary"
//                         onClick={() => navigate("/register-leagues")}
//                     >
//                         Register Player
//                     </button>

//                     <button
//                         className="btn-secondary"
//                         onClick={() => navigate("/view-leagues")}
//                     >
//                         View Leagues
//                     </button>

//                 </div>

//             </div>

//         </div>
//     );
// }

// export default Home;



import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css";


function Home() {
    const navigate = useNavigate();

    // ✅ Use images from PUBLIC folder (IMPORTANT)
    const images = [
        // "/sm.jpg",
        "/logo.jpeg",
        "/rs.jpg",
        "/sm.jpg",
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

                <h1 className="home-title">BatBall VC</h1>

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