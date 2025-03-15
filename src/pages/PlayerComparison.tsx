
import React, { useState, useMemo } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChartContainer, 
  ChartLegend, 
  ChartLegendContent 
} from "@/components/ui/chart";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ScatterChart, 
  Scatter, 
  ZAxis,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { Player, Position, mockData } from '@/utils/mockData';
import { ArrowDownUp, Radar as RadarIcon, BarChart2, ScatterChart as ScatterIcon } from 'lucide-react';

// Type definitions
type StatCategory = 'Attacking' | 'Defensive' | 'Passing' | 'Physical' | 'Form';
type StatType = {
  key: string;
  label: string;
  category: StatCategory;
  description: string;
  accessor: (player: Player) => number | undefined;
};

// Define player colors before using them
const playerColors = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#4f46e5'];

const PlayerComparison = () => {
  // State management
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [position, setPosition] = useState<Position | 'ALL'>('ALL');
  const [statCategory, setStatCategory] = useState<StatCategory>('Attacking');
  const [chartType, setChartType] = useState<'radar' | 'bar' | 'scatter'>('radar');
  const [scatterXStat, setScatterXStat] = useState<string>('goals');
  const [scatterYStat, setScatterYStat] = useState<string>('assists');
  const [showPlayerSelector, setShowPlayerSelector] = useState<boolean>(false);

  // Get colors for players
  const getPlayerColor = (player: Player): string => {
    const index = selectedPlayers.findIndex(p => p.id === player.id);
    return playerColors[index % playerColors.length];
  };

  // Available statistics
  const stats: StatType[] = [
    // Attacking Stats
    { key: 'goals', label: 'Goals', category: 'Attacking', description: 'Total goals scored', accessor: (p) => p.goals },
    { key: 'assists', label: 'Assists', category: 'Attacking', description: 'Total assists', accessor: (p) => p.assists },
    { key: 'xG', label: 'Expected Goals (xG)', category: 'Attacking', description: 'Expected goals based on chance quality', accessor: (p) => p.xG },
    { key: 'shotAccuracy', label: 'Shot Accuracy %', category: 'Attacking', description: 'Percentage of shots on target', accessor: (p) => p.shotAccuracy },
    
    // Defensive Stats
    { key: 'tackles', label: 'Tackles', category: 'Defensive', description: 'Number of successful tackles', accessor: (p) => p.tackles },
    { key: 'interceptions', label: 'Interceptions', category: 'Defensive', description: 'Number of interceptions', accessor: (p) => p.interceptions },
    { key: 'cleanSheets', label: 'Clean Sheets', category: 'Defensive', description: 'Matches without conceding a goal', accessor: (p) => p.cleanSheets },
    
    // Passing Stats
    { key: 'passingAccuracy', label: 'Pass Accuracy %', category: 'Passing', description: 'Percentage of successful passes', accessor: (p) => p.passingAccuracy },
    { key: 'keyPasses', label: 'Key Passes', category: 'Passing', description: 'Passes leading to a shot', accessor: (p) => p.keyPasses },
    
    // Form Stats
    { key: 'form', label: 'Form Rating', category: 'Form', description: 'Player form rating (out of 10)', accessor: (p) => p.form },
    { key: 'totalPoints', label: 'Total Points', category: 'Form', description: 'Fantasy points accumulated', accessor: (p) => p.totalPoints },
    { key: 'pointsPerGame', label: 'Points Per Game', category: 'Form', description: 'Average fantasy points per game', accessor: (p) => p.pointsPerGame },
  ];

  // Filter players by position
  const filteredPlayers = useMemo(() => {
    return position === 'ALL' 
      ? mockData.players 
      : mockData.players.filter(player => player.position === position);
  }, [position]);

  // Filter stats by category
  const filteredStats = useMemo(() => {
    return stats.filter(stat => stat.category === statCategory);
  }, [statCategory]);

  // Handle player selection
  const handlePlayerSelect = (playerId: string) => {
    const player = mockData.players.find(p => p.id === parseInt(playerId));
    if (!player) return;
    
    if (selectedPlayers.find(p => p.id === player.id)) {
      // Remove player if already selected
      setSelectedPlayers(prev => prev.filter(p => p.id !== player.id));
    } else if (selectedPlayers.length < (chartType === 'scatter' ? 8 : 4)) {
      // Add player if limit not reached
      setSelectedPlayers(prev => [...prev, player]);
    }
  };

  // Prepare data for radar chart
  const radarData = useMemo(() => {
    if (selectedPlayers.length === 0 || filteredStats.length === 0) return [];
    
    return filteredStats.map(stat => {
      const data: { [key: string]: any } = { 
        stat: stat.label 
      };
      
      selectedPlayers.forEach(player => {
        const value = stat.accessor(player);
        data[player.name] = value !== undefined ? value : 0;
      });
      
      return data;
    });
  }, [selectedPlayers, filteredStats]);

  // Prepare data for bar chart
  const barData = useMemo(() => {
    if (selectedPlayers.length === 0 || filteredStats.length === 0) return [];
    
    const result: any[] = [];
    
    filteredStats.forEach(stat => {
      selectedPlayers.forEach(player => {
        const value = stat.accessor(player);
        result.push({
          player: player.name,
          stat: stat.label,
          value: value !== undefined ? value : 0,
          color: getPlayerColor(player)
        });
      });
    });
    
    return result;
  }, [selectedPlayers, filteredStats]);

  // Prepare data for scatter chart
  const scatterData = useMemo(() => {
    if (selectedPlayers.length === 0) return [];
    
    const xStat = stats.find(s => s.key === scatterXStat);
    const yStat = stats.find(s => s.key === scatterYStat);
    
    if (!xStat || !yStat) return [];
    
    return selectedPlayers.map(player => ({
      name: player.name,
      x: xStat.accessor(player) || 0,
      y: yStat.accessor(player) || 0,
      z: 200,
      color: getPlayerColor(player)
    }));
  }, [selectedPlayers, scatterXStat, scatterYStat, stats]);

  // Generate insights about player comparison
  const generateInsights = () => {
    if (selectedPlayers.length < 2) {
      return "Select at least two players to see AI insights.";
    }
    
    const player1 = selectedPlayers[0];
    const player2 = selectedPlayers[1];
    
    const insights = [
      // Form comparison
      player1.form > player2.form ? 
        `${player1.name} is in better form than ${player2.name} with a rating of ${player1.form} vs ${player2.form}.` :
        `${player2.name} is in better form than ${player1.name} with a rating of ${player2.form} vs ${player1.form}.`,
      
      // Goals comparison
      player1.goals > player2.goals ?
        `${player1.name} has scored more goals (${player1.goals}) than ${player2.name} (${player2.goals}).` :
        `${player2.name} has scored more goals (${player2.goals}) than ${player1.name} (${player1.goals}).`,
      
      // xG efficiency
      player1.goals > player1.xG && player2.goals <= player2.xG ?
        `${player1.name} is overperforming their xG, while ${player2.name} is not.` :
        player2.goals > player2.xG && player1.goals <= player1.xG ?
        `${player2.name} is overperforming their xG, while ${player1.name} is not.` :
        `Both players are ${player1.goals > player1.xG ? 'overperforming' : 'underperforming'} their xG.`
    ];
    
    return insights.join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Player Comparison</h1>
        
        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Position Filter</label>
            <Select 
              value={position} 
              onValueChange={(value) => {
                setPosition(value as Position | 'ALL');
                // Reset player selection when changing position
                setSelectedPlayers([]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Positions</SelectItem>
                <SelectItem value="GK">Goalkeeper</SelectItem>
                <SelectItem value="DEF">Defender</SelectItem>
                <SelectItem value="MID">Midfielder</SelectItem>
                <SelectItem value="FWD">Forward</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Stat Category</label>
            <Select 
              value={statCategory} 
              onValueChange={(value) => setStatCategory(value as StatCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Attacking">Attacking Stats</SelectItem>
                <SelectItem value="Defensive">Defensive Stats</SelectItem>
                <SelectItem value="Passing">Passing & Playmaking</SelectItem>
                <SelectItem value="Form">Form & Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Chart Selection */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setChartType('radar')}
            className={cn(
              "inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium",
              chartType === 'radar' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <RadarIcon size={16} /> Radar
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={cn(
              "inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium",
              chartType === 'bar' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <BarChart2 size={16} /> Bar
          </button>
          <button
            onClick={() => setChartType('scatter')}
            className={cn(
              "inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-sm font-medium",
              chartType === 'scatter' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <ScatterIcon size={16} /> Scatter
          </button>
        </div>
        
        {/* Button to show player selection */}
        <button
          onClick={() => setShowPlayerSelector(!showPlayerSelector)}
          className="w-full mb-6 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md flex items-center justify-center gap-2"
        >
          <span>{showPlayerSelector ? "Hide Player Selection" : "Select Players"}</span>
          <span className="text-xs opacity-80">({selectedPlayers.length}/{chartType === 'scatter' ? 8 : 4})</span>
        </button>
        
        {/* Player selection */}
        {showPlayerSelector && (
          <div className="mb-8">
            <div className="bg-muted p-4 rounded-md">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                {filteredPlayers.slice(0, 20).map((player) => (
                  <div
                    key={player.id}
                    onClick={() => handlePlayerSelect(player.id.toString())}
                    className={cn(
                      "p-2 border rounded-md cursor-pointer text-sm transition-colors text-center",
                      selectedPlayers.some(p => p.id === player.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:bg-muted"
                    )}
                  >
                    <div className="font-medium truncate">{player.name}</div>
                    <div className="text-xs opacity-80">{player.position} - {player.team}</div>
                  </div>
                ))}
              </div>
              
              {filteredPlayers.length > 20 && (
                <div className="text-center text-sm text-muted-foreground">
                  Showing 20 of {filteredPlayers.length} players. Use the position filter to narrow down results.
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Selected players chips */}
        {selectedPlayers.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedPlayers.map((player) => (
              <div
                key={player.id}
                className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${getPlayerColor(player)}20`, color: getPlayerColor(player) }}
              >
                {player.name}
                <button
                  onClick={() => setSelectedPlayers(prev => prev.filter(p => p.id !== player.id))}
                  className="ml-1 hover:opacity-80"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Visualization */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          {selectedPlayers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ArrowDownUp className="mx-auto mb-3 opacity-30" size={48} />
              <p className="text-lg font-medium">Select players to compare</p>
              <p className="text-sm">Use the "Select Players" button above to choose players</p>
            </div>
          ) : (
            <>
              {chartType === 'radar' && (
                <div className="h-[400px]">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="stat" />
                        {selectedPlayers.map((player, index) => (
                          <Radar
                            key={player.id}
                            name={player.name}
                            dataKey={player.name}
                            stroke={playerColors[index % playerColors.length]}
                            fill={playerColors[index % playerColors.length]}
                            fillOpacity={0.1}
                          />
                        ))}
                        <Legend content={<ChartLegendContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
              
              {chartType === 'bar' && (
                <div className="h-[400px]">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="stat" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Value">
                          {barData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
              
              {chartType === 'scatter' && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">X Axis</label>
                      <Select 
                        value={scatterXStat} 
                        onValueChange={setScatterXStat}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select X stat" />
                        </SelectTrigger>
                        <SelectContent>
                          {stats.map(stat => (
                            <SelectItem key={stat.key} value={stat.key}>{stat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Y Axis</label>
                      <Select 
                        value={scatterYStat} 
                        onValueChange={setScatterYStat}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Y stat" />
                        </SelectTrigger>
                        <SelectContent>
                          {stats.map(stat => (
                            <SelectItem key={stat.key} value={stat.key}>{stat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="h-[400px]">
                    <ChartContainer config={{}}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            type="number" 
                            dataKey="x" 
                            name={stats.find(s => s.key === scatterXStat)?.label || ''} 
                          />
                          <YAxis 
                            type="number" 
                            dataKey="y" 
                            name={stats.find(s => s.key === scatterYStat)?.label || ''} 
                          />
                          <ZAxis type="number" dataKey="z" range={[100, 200]} />
                          <Tooltip 
                            cursor={{ strokeDasharray: '3 3' }}
                            formatter={(value, name) => [value, name]}
                          />
                          <Legend />
                          {selectedPlayers.map((player, index) => (
                            <Scatter 
                              key={player.id}
                              name={player.name} 
                              data={scatterData.filter(d => d.name === player.name)}
                              fill={playerColors[index % playerColors.length]} 
                            />
                          ))}
                        </ScatterChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </>
              )}
            </>
          )}
        </div>
        
        {/* Data Table */}
        {selectedPlayers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Player Stat Comparison</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stat</TableHead>
                    {selectedPlayers.map(player => (
                      <TableHead key={player.id}>{player.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStats.map(stat => (
                    <TableRow key={stat.key}>
                      <TableCell className="font-medium">
                        {stat.label}
                        <div className="text-xs text-muted-foreground">{stat.description}</div>
                      </TableCell>
                      {selectedPlayers.map(player => (
                        <TableCell key={player.id}>
                          {stat.accessor(player) !== undefined ? stat.accessor(player) : 'N/A'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        
        {/* AI Insights */}
        {selectedPlayers.length >= 2 && (
          <div className="bg-secondary/30 border border-secondary rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">AI Player Insights</h2>
            <p className="text-foreground/80">
              {generateInsights()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerComparison;
