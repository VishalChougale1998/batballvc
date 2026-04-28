// import { useEffect, useState } from "react";
// import BASE_URL from "../api";
// import LeagueCard from "../Components/LeagueCard";

// function RegisterLeagues() {
//     const [leagues, setLeagues] = useState([]);

//     useEffect(() => {
//         fetch(`${BASE_URL}/api/leagues`)
//             .then(res => res.json())
//             .then(setLeagues);
//     }, []);

//     return (
//         <><div className="main-container">
//             <h2 className="text-center mb-4">📝 Register Player</h2>

//             <div className="leagues-container">

//                 {leagues.map(l => (
//                     <LeagueCard key={l._id} league={l} showRegister={true} />
//                 ))}
//             </div></div>
//         </>
//     );
// }

// export default RegisterLeagues;

// =====================


import { useEffect, useState } from "react";
import BASE_URL from "../api";
import LeagueCard from "../Components/LeagueCard";

function RegisterLeagues() {
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/api/leagues`)
            .then(res => res.json())
            .then(data => setLeagues(data))
            .catch(err => console.error("Error fetching leagues:", err));
    }, []);

    return (
        <div className="container mt-4">
            {/* HEADER */}
            <div className="text-center mb-4">
                <h2>📝 Register Player</h2>
                <p className="text-muted">
                    Select a league to register players
                </p>
            </div>

            {/* LEAGUES GRID */}
            <div className="row">
                {leagues.length > 0 ? (
                    leagues.map((l) => (
                        <div key={l._id} className="col-md-4 mb-4">
                            <LeagueCard
                                league={l}
                                showRegister={true}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <p>No leagues available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RegisterLeagues;
