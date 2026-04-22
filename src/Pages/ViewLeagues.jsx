// import { useEffect, useState } from "react";
// import BASE_URL from "../api";
// import LeagueCard from "../Components/LeagueCard";

// function ViewLeagues() {
//     const [leagues, setLeagues] = useState([]);

//     useEffect(() => {
//         const fetchLeagues = async () => {
//             try {
//                 const res = await fetch(`${BASE_URL}/api/leagues`);
//                 const data = await res.json();
//                 setLeagues(data || []);
//             } catch (err) {
//                 console.error("Error fetching leagues:", err);
//                 setLeagues([]);
//             }
//         };

//         fetchLeagues();
//     }, []);

//     return (
//         <div className="container mt-4">

//             <h2 className="text-center mb-4">🏏 View Leagues</h2>

//             <div className="row">

//                 {leagues.length === 0 && (
//                     <p className="text-center text-muted">
//                         No leagues available
//                     </p>
//                 )}

//                 {leagues.map((league) => (
//                     <div
//                         className="col-md-4 col-sm-6 mb-4"
//                         key={league._id}
//                     >
//                         <LeagueCard
//                             league={league}
//                             showRegister={false}
//                         />
//                     </div>
//                 ))}

//             </div>
//         </div>
//     );
// }

// export default ViewLeagues;


// ====================================
import { useEffect, useState } from "react";
import BASE_URL from "../api";
import LeagueCard from "../Components/LeagueCard";

function ViewLeagues() {
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
        const fetchLeagues = async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/leagues`);
                const data = await res.json();
                setLeagues(data || []);
            } catch (err) {
                console.error("Error fetching leagues:", err);
                setLeagues([]);
            }
        };

        fetchLeagues();
    }, []);

    return (
        <div className="container mt-4">

            <h2 className="text-center mb-4">🏏 View Leagues</h2>

            <div className="row justify-content-center">

                {leagues.length === 0 && (
                    <p className="text-center text-muted">
                        No leagues available
                    </p>
                )}

                {leagues.map((league) => (
                    <div
                        className="col-lg-4 col-md-6 col-12 mb-4"
                        key={league._id}
                    >
                        <LeagueCard
                            league={league}
                            showRegister={false}
                        />
                    </div>
                ))}

            </div>
        </div>
    );
}

export default ViewLeagues;