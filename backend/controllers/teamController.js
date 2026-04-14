const Team = require("../models/Team");

// ✅ CREATE TEAM
exports.createTeam = async (req, res) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.json(team);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ GET TEAMS BY LEAGUE
exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find({ leagueId: req.params.leagueId });
        res.json(teams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ ADD PLAYER TO TEAM (AUCTION)
exports.addPlayerToTeam = async (req, res) => {
    try {
        const { teamId, playerId, price } = req.body;

        const team = await Team.findById(teamId);

        if (!team) return res.status(404).json({ msg: "Team not found" });

        // check purse
        if (team.purse < price) {
            return res.status(400).json({ msg: "Not enough purse" });
        }

        team.players.push({ playerId, price });
        team.purse -= price;

        await team.save();

        res.json(team);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ DELETE TEAM
exports.deleteTeam = async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id);
        res.json({ msg: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};