import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateLeague from "./Pages/CreateLeague";

import Leagues from "./Pages/Leagues";
import RegisterPlayer from "./Pages/RegisterPlayer";
import Auction from "./Pages/Auction";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import ViewLeagues from "./Pages/ViewLeagues";
import RegisterLeagues from "./Pages/RegisterLeagues";
import AdminLogin from "./Pages/AdminLogin";
import FixedAdmin from "./Pages/FixedAdmin";
import Footer from "./Components/Footer";

function App() {
  return (
    <Router>

      <Navbar />

      {/* 🔥 FIXED WRAPPER */}
      <div style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-league" element={<CreateLeague />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/view-leagues" element={<ViewLeagues />} />
          <Route path="/register-leagues" element={<RegisterLeagues />} />
          <Route path="/admin" element={<AdminLogin />} />
          {/* <Route path="/admin-panel" element={<Admin />} /> */}
          <Route path="/admin-panel" element={<FixedAdmin />} />
          <Route path="/register/:leagueId" element={<RegisterPlayer />} />
          <Route path="/auction/:leagueId" element={<Auction />} />
        </Routes>
      </div>

      <Footer />

    </Router>
  );
}

export default App;