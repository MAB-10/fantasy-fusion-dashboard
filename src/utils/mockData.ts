
// Player positions
export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

// Player interface
export interface Player {
  id: number;
  name: string;
  team: string;
  position: Position;
  price: number;
  totalPoints: number;
  form: number;
  xG: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  saves?: number;
  tackles?: number;
  interceptions?: number;
  passingAccuracy?: number;
  shotAccuracy?: number;
  keyPasses?: number;
  minutesPlayed: number;
  pointsPerGame: number;
  selected: number; // Selection percentage
  chanceOfPlaying: number;
  nextFixture: string;
  photoUrl?: string;
}

// Team interface
export interface Team {
  id: number;
  name: string;
  shortName: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: string; // Last 5 matches: W, D, L
  xG: number;
  xGA: number;
  possession: number;
  cleanSheets: number;
  logoUrl?: string;
}

// Formation interface
export interface Formation {
  name: string;
  structure: string; // e.g. "4-3-3", "3-5-2"
  positions: {
    GK: number;
    DEF: number;
    MID: number;
    FWD: number;
  };
}

// Generate random player data
export const generatePlayers = (count: number = 50): Player[] => {
  const positions: Position[] = ['GK', 'DEF', 'MID', 'FWD'];
  const teams = [
    'Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton', 
    'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Liverpool', 
    'Man City', 'Man Utd', 'Newcastle', 'Nott\'m Forest', 'Southampton', 
    'Tottenham', 'West Ham', 'Wolves', 'Leicester', 'Leeds'
  ];
  
  const players: Player[] = [];
  
  const firstNames = [
    'James', 'John', 'Robert', 'Michael', 'David', 'William', 'Richard', 'Thomas', 'Mark', 'Charles',
    'Mohammed', 'Ali', 'Omar', 'Ethan', 'Noah', 'Lucas', 'Mason', 'Oliver', 'Jacob', 'Harry',
    'Leo', 'Jack', 'Charlie', 'Freddie', 'Alfie', 'George', 'Oscar', 'Theo', 'Arthur', 'Henry',
    'Kai', 'Ruben', 'Bruno', 'Thiago', 'Phil', 'Marcus', 'Mason', 'Trent', 'Virgil', 'Kevin'
  ];
  
  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
    'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White',
    'Kane', 'Salah', 'Silva', 'De Bruyne', 'Fernandes', 'Alexander-Arnold', 'Van Dijk', 'Sterling', 'Foden', 'Rashford',
    'Mount', 'Dias', 'Havertz', 'Son', 'Saka', 'Rice', 'James', 'Chilwell', 'Walker', 'Cancelo'
  ];
  
  for (let i = 0; i < count; i++) {
    const position = positions[Math.floor(Math.random() * positions.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const team = teams[Math.floor(Math.random() * teams.length)];
    
    // Generate stats based on position
    let goals = 0;
    let assists = 0;
    let cleanSheets = 0;
    let saves = 0;
    let tackles = 0;
    let interceptions = 0;
    let passingAccuracy = 0;
    let shotAccuracy = 0;
    let keyPasses = 0;
    
    switch (position) {
      case 'GK':
        cleanSheets = Math.floor(Math.random() * 10);
        saves = 30 + Math.floor(Math.random() * 70);
        passingAccuracy = 30 + Math.floor(Math.random() * 40);
        break;
      case 'DEF':
        goals = Math.floor(Math.random() * 4);
        assists = Math.floor(Math.random() * 5);
        cleanSheets = Math.floor(Math.random() * 12);
        tackles = 20 + Math.floor(Math.random() * 80);
        interceptions = 10 + Math.floor(Math.random() * 60);
        passingAccuracy = 40 + Math.floor(Math.random() * 40);
        break;
      case 'MID':
        goals = Math.floor(Math.random() * 10);
        assists = Math.floor(Math.random() * 12);
        cleanSheets = Math.floor(Math.random() * 8);
        tackles = 10 + Math.floor(Math.random() * 50);
        interceptions = 5 + Math.floor(Math.random() * 30);
        passingAccuracy = 50 + Math.floor(Math.random() * 40);
        shotAccuracy = 30 + Math.floor(Math.random() * 40);
        keyPasses = 10 + Math.floor(Math.random() * 50);
        break;
      case 'FWD':
        goals = 5 + Math.floor(Math.random() * 20);
        assists = Math.floor(Math.random() * 10);
        shotAccuracy = 40 + Math.floor(Math.random() * 40);
        keyPasses = 5 + Math.floor(Math.random() * 30);
        passingAccuracy = 40 + Math.floor(Math.random() * 40);
        break;
    }
    
    const minutesPlayed = 500 + Math.floor(Math.random() * 2000);
    const totalPoints = 
      goals * 4 + 
      assists * 3 + 
      cleanSheets * (position === 'GK' || position === 'DEF' ? 4 : position === 'MID' ? 1 : 0) +
      Math.floor(minutesPlayed / 90) * 2 +
      (position === 'GK' ? Math.floor(saves / 3) : 0);
    
    const pointsPerGame = Math.round((totalPoints / (minutesPlayed / 90)) * 10) / 10;
    
    players.push({
      id: i + 1,
      name,
      team,
      position,
      price: (4 + Math.random() * 8).toFixed(1),
      totalPoints,
      form: Math.round(Math.random() * 10 * 10) / 10,
      xG: Math.round(Math.random() * goals * 1.2 * 10) / 10,
      goals,
      assists,
      cleanSheets,
      saves: position === 'GK' ? saves : undefined,
      tackles: position !== 'GK' ? tackles : undefined,
      interceptions: position !== 'GK' ? interceptions : undefined,
      passingAccuracy,
      shotAccuracy: position !== 'GK' ? shotAccuracy : undefined,
      keyPasses: position !== 'GK' ? keyPasses : undefined,
      minutesPlayed,
      pointsPerGame,
      selected: Math.round(Math.random() * 50 * 10) / 10,
      chanceOfPlaying: Math.random() > 0.1 ? 100 : Math.round(Math.random() * 75),
      nextFixture: `${teams[Math.floor(Math.random() * teams.length)]} (${Math.random() > 0.5 ? 'H' : 'A'})`,
      photoUrl: undefined, // We'll use placeholders for now
    });
  }
  
  return players;
};

// Generate random team data
export const generateTeams = (): Team[] => {
  const teamNames = [
    'Arsenal', 'Aston Villa', 'Bournemouth', 'Brentford', 'Brighton', 
    'Chelsea', 'Crystal Palace', 'Everton', 'Fulham', 'Liverpool', 
    'Man City', 'Man Utd', 'Newcastle', 'Nott\'m Forest', 'Southampton', 
    'Tottenham', 'West Ham', 'Wolves', 'Leicester', 'Leeds'
  ];
  
  const shortNames = [
    'ARS', 'AVL', 'BOU', 'BRE', 'BHA',
    'CHE', 'CRY', 'EVE', 'FUL', 'LIV',
    'MCI', 'MUN', 'NEW', 'NFO', 'SOU',
    'TOT', 'WHU', 'WOL', 'LEI', 'LEE'
  ];
  
  const teams: Team[] = [];
  let usedPositions: number[] = [];
  
  for (let i = 0; i < 20; i++) {
    let position: number;
    do {
      position = Math.floor(Math.random() * 20) + 1;
    } while (usedPositions.includes(position));
    
    usedPositions.push(position);
    
    const played = 28 + Math.floor(Math.random() * 6);
    const won = Math.floor(Math.random() * Math.min(played, 25));
    const drawn = Math.floor(Math.random() * Math.min(played - won, 15));
    const lost = played - won - drawn;
    
    const gf = won * 2 + drawn + Math.floor(Math.random() * 20);
    const ga = lost * 2 + drawn + Math.floor(Math.random() * 15);
    
    const formOptions = ['W', 'D', 'L'];
    let form = '';
    for (let j = 0; j < 5; j++) {
      const randomIndex = Math.floor(Math.random() * 3);
      form += formOptions[randomIndex];
    }
    
    teams.push({
      id: i + 1,
      name: teamNames[i],
      shortName: shortNames[i],
      position,
      played,
      won,
      drawn,
      lost,
      gf,
      ga,
      gd: gf - ga,
      points: won * 3 + drawn,
      form,
      xG: Math.round((gf + Math.random() * 10 - 5) * 10) / 10,
      xGA: Math.round((ga + Math.random() * 10 - 5) * 10) / 10,
      possession: Math.round((40 + Math.random() * 25) * 10) / 10,
      cleanSheets: Math.floor(Math.random() * 15),
      logoUrl: undefined, // We'll use placeholders for now
    });
  }
  
  // Sort teams by position
  teams.sort((a, b) => a.position - b.position);
  
  return teams;
};

// Generate the best XI based on player data
export const generateBestXI = (
  players: Player[], 
  formation: Formation = { 
    name: '4-3-3', 
    structure: '4-3-3',
    positions: { GK: 1, DEF: 4, MID: 3, FWD: 3 } 
  }
): Player[] => {
  const positions = ['GK', 'DEF', 'MID', 'FWD'] as Position[];
  const bestXI: Player[] = [];
  
  // Filter out players with low chance of playing
  const availablePlayers = players.filter(player => player.chanceOfPlaying > 75);
  
  // Sort players by total points
  const sortedPlayers = [...availablePlayers].sort((a, b) => b.form - a.form);
  
  // Select players for each position according to formation
  positions.forEach(position => {
    const positionPlayers = sortedPlayers.filter(player => player.position === position);
    const requiredCount = formation.positions[position];
    
    for (let i = 0; i < requiredCount && i < positionPlayers.length; i++) {
      bestXI.push(positionPlayers[i]);
    }
  });
  
  return bestXI;
};

// List of available formations
export const formations: Formation[] = [
  { 
    name: '4-3-3', 
    structure: '4-3-3',
    positions: { GK: 1, DEF: 4, MID: 3, FWD: 3 } 
  },
  { 
    name: '4-4-2', 
    structure: '4-4-2',
    positions: { GK: 1, DEF: 4, MID: 4, FWD: 2 } 
  },
  { 
    name: '3-5-2', 
    structure: '3-5-2',
    positions: { GK: 1, DEF: 3, MID: 5, FWD: 2 } 
  },
  { 
    name: '3-4-3', 
    structure: '3-4-3',
    positions: { GK: 1, DEF: 3, MID: 4, FWD: 3 } 
  },
  { 
    name: '5-3-2', 
    structure: '5-3-2',
    positions: { GK: 1, DEF: 5, MID: 3, FWD: 2 } 
  },
];

// Generate all mock data
export const mockData = {
  players: generatePlayers(100),
  teams: generateTeams(),
  formations,
};

export default mockData;
