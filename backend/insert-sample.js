import connectDB from './config/db.js';
import League from './models/League.js';
import Player from './models/Players.js';
import dotenv from 'dotenv';

dotenv.config();

await connectDB();

console.log('Sample data...');

// Clear existing
await League.deleteMany({});
await Player.deleteMany({});

const sampleLeague = await new League({
    name: 'Demo Village League',
    city: 'Demo City',
    slug: 'demo-league',
}).save();

console.log(`Created league: ${sampleLeague._id}`);

// Sample players
const samplePlayers = [
    { name: 'Virat Kohli', role: 'Batsman', village: 'Delhi', leagueId: sampleLeague._id },
    { name: 'Jasprit Bumrah', role: 'Bowler', village: 'Ahmedabad', leagueId: sampleLeague._id },
    { name: 'KL Rahul', role: 'Wicketkeeper', village: 'Bangalore', leagueId: sampleLeague._id },
    { name: 'Rishabh Pant', role: 'Batsman', village: 'Delhi', leagueId: sampleLeague._id },
    { name: 'Ravindra Jadeja', role: 'Allrounder', village: 'Chennai', leagueId: sampleLeague._id },
];

for (let playerData of samplePlayers) {
    await new Player(playerData).save();
}

console.log('Sample data inserted! League ID: ', sampleLeague._id);
console.log('Restart frontend and try Auction with /auction/' + sampleLeague._id);
