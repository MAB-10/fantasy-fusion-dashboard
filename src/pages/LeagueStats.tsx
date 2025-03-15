import React, { useState, useMemo } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
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
  LineChart,
  Line
} from 'recharts';
import { mockData, Team } from '@/utils/mockData';
import { ArrowUpDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type TeamStat = {
  id: number;
  name: string;
  position: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
  xG: number;
  xGA: number;
  possession: number;
  passAccuracy: number;
  tackles: number;
  interceptions: number;
  cleanSheets: number;
};

type SortDirection = 'asc' | 'desc';
type SortField = keyof TeamStat;

const LeagueStats = () => {
  const [sortField, setSortField] = useState<SortField>('position');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedMetric, setSelectedMetric] = useState<'attacking' | 'defensive' | 'possession'>('attacking');
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  
  // Fix: map the teams array from mockData to the TeamStat type
  const teamStats: TeamStat[] = useMemo(() => {
    return mockData.teams.map(team => ({
      id: team.id,
      name: team.name,
      position: team.position,
      played: team.played,
      won: team.won,
      drawn: team.drawn,
      lost: team.lost,
      goalsFor: team.gf,
      goalsAgainst: team.ga,
      goalDifference: team.gd,
      points: team.points,
      form: team.form,
      xG: team.xG,
      xGA: team.xGA,
      possession: team.possession,
      passAccuracy: Math.round(Math.random() * 30 + 65), // Generate random pass accuracy as it's not in the Team type
      tackles: Math.round(Math.random() * 50 + 150), // Generate random tackles as it's not in the Team type
      interceptions: Math.round(Math.random() * 40 + 120), // Generate random interceptions as it's not in the Team type
      cleanSheets: team.cleanSheets,
    }));
  }, []);
  
  // Sort function for team stats
  const sortedTeamStats = useMemo(() => {
    return [...teamStats].sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      return 0;
    });
  }, [teamStats, sortField, sortDirection]);
  
  // Function to handle column sort
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Chart data for attacking stats
  const attackingData = useMemo(() => {
    return teamStats.map(team => ({
      name: team.name,
      goals: team.goalsFor,
      xG: team.xG,
      goalDifference: team.goalDifference,
      isSelected: team.id === selectedTeam
    }));
  }, [teamStats, selectedTeam]);
  
  // Chart data for defensive stats
  const defensiveData = useMemo(() => {
    return teamStats.map(team => ({
      name: team.name,
      goalsAgainst: team.goalsAgainst,
      xGA: team.xGA,
      cleanSheets: team.cleanSheets,
      tackles: team.tackles,
      isSelected: team.id === selectedTeam
    }));
  }, [teamStats, selectedTeam]);
  
  // Chart data for possession stats
  const possessionData = useMemo(() => {
    return teamStats.map(team => ({
      name: team.name,
      possession: team.possession,
      passAccuracy: team.passAccuracy,
      isSelected: team.id === selectedTeam
    }));
  }, [teamStats, selectedTeam]);
  
  // AI-generated insights
  const generateInsights = () => {
    const goalLeader = [...teamStats].sort((a, b) => b.goalsFor - a.goalsFor)[0];
    const defenseLeader = [...teamStats].sort((a, b) => a.goalsAgainst - b.goalsAgainst)[0];
    const xGOverperformer = [...teamStats].sort((a, b) => (b.goalsFor - b.xG) - (a.goalsFor - a.xG))[0];
    const possessionLeader = [...teamStats].sort((a, b) => b.possession - a.possession)[0];
    
    return (
      <div className="space-y-2">
        <p><strong>{goalLeader.name}</strong> leads the league in scoring with {goalLeader.goalsFor} goals in {goalLeader.played} matches.</p>
        <p><strong>{defenseLeader.name}</strong> has the best defense, conceding only {defenseLeader.goalsAgainst} goals.</p>
        <p><strong>{xGOverperformer.name}</strong> is overperforming their xG by {(xGOverperformer.goalsFor - xGOverperformer.xG).toFixed(1)} goals.</p>
        <p><strong>{possessionLeader.name}</strong> dominates possession with an average of {possessionLeader.possession}%.</p>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Team League Stats & Table</h1>
        
        <Tabs defaultValue="table" className="w-full mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="table">League Table</TabsTrigger>
            <TabsTrigger value="stats">Team Statistics</TabsTrigger>
          </TabsList>
          
          {/* League Table Tab */}
          <TabsContent value="table" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Premier League 2023/24</h2>
              <div className="text-sm text-muted-foreground">
                Showing all 20 teams
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="w-[60px] cursor-pointer"
                      onClick={() => handleSort('position')}
                    >
                      <div className="flex items-center">
                        Pos
                        {sortField === 'position' && (
                          <ArrowUpDown size={16} className="ml-1" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center">
                        Team
                        {sortField === 'name' && (
                          <ArrowUpDown size={16} className="ml-1" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-center cursor-pointer"
                      onClick={() => handleSort('played')}
                    >
                      Played
                    </TableHead>
                    <TableHead 
                      className="text-center cursor-pointer"
                      onClick={() => handleSort('won')}
                    >
                      W
                    </TableHead>
                    <TableHead 
                      className="text-center cursor-pointer"
                      onClick={() => handleSort('drawn')}
                    >
                      D
                    </TableHead>
                    <TableHead 
                      className="text-center cursor-pointer"
                      onClick={() => handleSort('lost')}
                    >
                      L
                    </TableHead>
                    <TableHead 
                      className="text-center cursor-pointer"
                      onClick={() => handleSort('goalsFor')}
                    >
                      GF
                    </TableHead>
                    <TableHead 
                      className="text-center cursor-pointer"
                      onClick={() => handleSort('goalsAgainst')}
                    >
                      GA
                    </TableHead>
                    <TableHead 
                      className="text-center cursor-pointer"
                      onClick={() => handleSort('goalDifference')}
                    >
                      GD
                    </TableHead>
                    <TableHead 
                      className="text-center cursor-pointer"
                      onClick={() => handleSort('points')}
                    >
                      <div className="flex items-center justify-center">
                        Points
                        {sortField === 'points' && (
                          <ArrowUpDown size={16} className="ml-1" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Form</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTeamStats.map((team) => (
                    <TableRow 
                      key={team.id}
                      className={cn(
                        team.id === selectedTeam && "bg-muted",
                        "cursor-pointer hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedTeam(team.id === selectedTeam ? null : team.id)}
                    >
                      <TableCell>{team.position}</TableCell>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell className="text-center">{team.played}</TableCell>
                      <TableCell className="text-center">{team.won}</TableCell>
                      <TableCell className="text-center">{team.drawn}</TableCell>
                      <TableCell className="text-center">{team.lost}</TableCell>
                      <TableCell className="text-center">{team.goalsFor}</TableCell>
                      <TableCell className="text-center">{team.goalsAgainst}</TableCell>
                      <TableCell className="text-center">{team.goalDifference}</TableCell>
                      <TableCell className="text-center font-bold">{team.points}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-1">
                          {team.form.split('').map((result, index) => (
                            <span 
                              key={index}
                              className={cn(
                                "inline-block w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center",
                                result === 'W' && "bg-green-500 text-white",
                                result === 'D' && "bg-yellow-500 text-white",
                                result === 'L' && "bg-red-500 text-white"
                              )}
                            >
                              {result}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Team Statistics Tab */}
          <TabsContent value="stats" className="mt-6">
            <div className="mb-6">
              <Select
                value={selectedMetric}
                onValueChange={(value) => setSelectedMetric(value as 'attacking' | 'defensive' | 'possession')}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="attacking">Attacking Stats</SelectItem>
                  <SelectItem value="defensive">Defensive Stats</SelectItem>
                  <SelectItem value="possession">Possession Stats</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="mt-2 text-sm text-muted-foreground">
                Click on a team in the chart or table to highlight their stats
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 mb-8">
              {selectedMetric === 'attacking' && (
                <div className="h-[400px]">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attackingData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="goals" 
                          name="Goals Scored" 
                          fill="#2563eb" 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="xG" 
                          name="Expected Goals (xG)" 
                          fill="#7c3aed" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
              
              {selectedMetric === 'defensive' && (
                <div className="h-[400px]">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={defensiveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="goalsAgainst" 
                          name="Goals Conceded" 
                          fill="#dc2626" 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="cleanSheets" 
                          name="Clean Sheets" 
                          fill="#059669" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
              
              {selectedMetric === 'possession' && (
                <div className="h-[400px]">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="possession" 
                          name="Possession %" 
                          domain={[30, 70]} 
                        />
                        <YAxis 
                          type="number" 
                          dataKey="passAccuracy" 
                          name="Pass Accuracy %" 
                          domain={[60, 95]} 
                        />
                        <ZAxis range={[60, 400]} />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                        <Legend />
                        <Scatter 
                          name="Teams" 
                          data={possessionData} 
                          fill="#6d28d9"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
            </div>
            
            {/* Selected Team Details */}
            {selectedTeam && (
              <div className="bg-muted p-6 rounded-lg mb-8">
                <h3 className="text-lg font-bold mb-4">
                  {teamStats.find(t => t.id === selectedTeam)?.name} - Detailed Stats
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="font-medium text-center mb-2">Attacking</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Goals:</span>
                        <span className="font-medium">{teamStats.find(t => t.id === selectedTeam)?.goalsFor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>xG:</span>
                        <span className="font-medium">{teamStats.find(t => t.id === selectedTeam)?.xG.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>xG Difference:</span>
                        <span className="font-medium">
                          {(teamStats.find(t => t.id === selectedTeam)?.goalsFor || 0) - 
                           (teamStats.find(t => t.id === selectedTeam)?.xG || 0) > 0 ? '+' : ''}
                          {((teamStats.find(t => t.id === selectedTeam)?.goalsFor || 0) - 
                            (teamStats.find(t => t.id === selectedTeam)?.xG || 0)).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="font-medium text-center mb-2">Defensive</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Goals Against:</span>
                        <span className="font-medium">{teamStats.find(t => t.id === selectedTeam)?.goalsAgainst}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clean Sheets:</span>
                        <span className="font-medium">{teamStats.find(t => t.id === selectedTeam)?.cleanSheets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tackles:</span>
                        <span className="font-medium">{teamStats.find(t => t.id === selectedTeam)?.tackles}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-card p-4 rounded-lg">
                    <h4 className="font-medium text-center mb-2">Possession</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Possession %:</span>
                        <span className="font-medium">{teamStats.find(t => t.id === selectedTeam)?.possession}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pass Accuracy:</span>
                        <span className="font-medium">{teamStats.find(t => t.id === selectedTeam)?.passAccuracy}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* AI Insights Section */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info size={20} className="text-primary" />
            <h2 className="text-xl font-bold">AI Insights</h2>
          </div>
          <div className="text-foreground/80">
            {generateInsights()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueStats;
