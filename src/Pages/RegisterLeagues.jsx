import { useEffect, useState } from "react";
import BASE_URL from "../api";
import LeagueCard from "../Components/LeagueCard";

function RegisterLeagues() {
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/api/leagues`)
            .then(res => res.json())
            .then(setLeagues);
    }, []);

    return (
        <><div className="main-container">
            <h2 className="text-center mb-4">📝 Register Player</h2>

            <div className="leagues-container">

                {leagues.map(l => (
                    <LeagueCard key={l._id} league={l} showRegister={true} />
                ))}
            </div></div>
        </>
    );
}

export default RegisterLeagues;