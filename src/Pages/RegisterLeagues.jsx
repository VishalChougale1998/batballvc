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

// =====================================

import { useEffect, useState } from "react";
import BASE_URL from "../api";
import LeagueCard from "../Components/LeagueCard";

function RegisterLeagues() {
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/leagues`);
                const data = await res.json();

                console.log("Leagues:", data); // ✅ debug

                setLeagues(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching leagues:", err);
                setLeagues([]);
            }
        };

        fetchLeagues();
    }, []);

    return (
        <div className="main-container">
            <h2 className="text-center mb-4">📝 Register Player</h2>

            <div className="leagues-container">

                {leagues.length === 0 && (
                    <p className="text-center text-muted">
                        No leagues available
                    </p>
                )}

                {leagues.map((league) => (
                    <LeagueCard
                        key={league._id}
                        league={league}
                        showRegister={true}
                    />
                ))}

            </div>
        </div>
    );
}

export default RegisterLeagues;