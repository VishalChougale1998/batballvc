import { getPlayers, getLeagues, getTeams, updatePlayers, updateTeams, saveLeague } from '../simpleStorage.js';

// Test photo base64 (small orange player icon)
const testPhoto = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8Alt4K0fZ0+kuA2h8Z6z7b6IV8OlyYcT8jru3m5z7G8QMc//2Q=='; // Tiny placeholder

// Generate test data
const testLeague = 'test2024';
const testPlayers = [
  {
    id: 1,
    name: 'Test Batsman',
    role: 'Batsman',
    village: 'Test Village',
    leagueId: testLeague,
    photo: testPhoto,
    status: 'sold'
  },
  {
    id: 2,
    name: 'Test Bowler',
    role: 'Bowler',
    village: 'Test Village',
    leagueId: testLeague,
    photo: testPhoto,
    status: 'sold'
  }
];

const testTeam = {
  id: 999,
  name: 'Test Team',
  purse: 40000,
  players: [1, 2],
  leagueId: testLeague
};

console.log('🧪 Loading test data...');

const players = getPlayers();
players = [...players, ...testPlayers];
updatePlayers([...players, ...testPlayers]);

const teams = getTeams();
updateTeams([...teams, testTeam]);

const leagues = getLeagues();
if (!leagues.find(l => l.slug === testLeague)) {
  saveLeague({
    slug: testLeague,
    name: 'Test League 2024',
    city: 'Test City'
  });
}

console.log('✅ Test data loaded! Go to /auction/test2024');
console.log('Players:', testPlayers.length, 'Team:', testTeam.name);

alert('Test data loaded! Navigate to /auction/test2024 to see photos.');

