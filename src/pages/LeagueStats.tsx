
import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { mockData, Team } from '@/utils/mockData';
import { 
  BarChart2, 
  LineChart as LineChartIcon, 
  ScatterChart as ScatterChartIcon, 
  Trophy, 
  Filter 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type LeagueStatView = 'table' | 'attacking' | 'defensive' | 'possession';
type TableSortKey = 'position' | 'points' | 'gd' | 'xG' | 'xGA' | 'possession' | 'cleanSheets';

const LeagueStats = () => {
  // State management
  const [statView, setStatView] = useState<LeagueStatView>('table');
  const [sortKey, setSortKey] = useState<TableSortKey>('position');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [season, setSeason] = useState('2023/24');

  // Team data
  const teams = mockData.teams;

  // Handle sort click
  const handleSort = (key: TableSortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Sort teams based on current sort settings
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];
      
      const compareResult = typeof valueA === 'string' && typeof valueB === 'string'
        ? valueA.localeCompare(valueB)
        : (valueA as number) - (valueB as number);
      
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  }, [teams, sortKey, sortDirection]);

  // Prepare data for xG vs. Goals chart
  const xgVsGoalsData = useMemo(() => {
    return teams.map(team => ({
      name: team.shortName,
      xG: team.xG,
      goals: team.gf,
      difference: Math.round((team.gf - team.xG) * 10) / 10,
      color: team.gf > team.xG ? '#22c55e' : team.gf < team.xG ? '#ef4444' : '#3b82f6'
    }));
  }, [teams]);

  // Prepare data for possession vs. pass accuracy scatter plot
  const possessionData = useMemo(() => {
    return teams.map(team => ({
      name: team.shortName,
      possession: team.possession,
      passAccuracy: 30 + Math.random() * 40, // Mock data as we don't have pass accuracy
      goals: team.gf,
      position: team.position
    }));
  }, [teams]);

  // Prepare data for defensive strength bar chart
  const defensiveData = useMemo(() => {
    return [...teams]
      .sort((a, b) => b.cleanSheets - a.cleanSheets)
      .slice(0, 10)
      .map(team => ({
        name: team.shortName,
        cleanSheets: team.cleanSheets,
        goalsAgainst: team.ga,
        xGA: team.xGA
      }));
  }, [teams]);

  // Generate AI insights
  const generateInsights = () => {
    // Team with most goals
    const topScorer = [...teams].sort((a, b) => b.gf - a.gf)[0];
    
    // Team with best defense
    const bestDefense = [...teams].sort((a, b) => a.ga - b.ga)[0];
    
    // Team with biggest xG overperformance
    const biggestOverperformer = [...teams].sort((a, b) => (b.gf - b.xG) - (a.gf - a.xG))[0];
    
    // Team with biggest xG underperformance
    const biggestUnderperformer = [...teams].sort((a, b) => (a.gf - a.xG) - (b.gf - b.xG))[0];
    
    return [
      `${topScorer.name} leads the league in scoring with ${topScorer.gf} goals, averaging ${(topScorer.gf / topScorer.played).toFixed(1)} per game.`,
      `${bestDefense.name} has the strongest defense, conceding only ${bestDefense.ga} goals in ${bestDefense.played} matches.`,
      `${biggestOverperformer.name} is overperforming their xG by ${(biggestOverperformer.gf - biggestOverperformer.xG).toFixed(1)} goals, showing clinical finishing.`,
      `${biggestUnderperformer.name} is underperforming their xG by ${Math.abs(biggestUnderperformer.gf - biggestUnderperformer.xG).toFixed(1)} goals, indicating finishing problems.`
    ];
  };

  const insights = generateInsights();

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">League Statistics</h1>
            <p className="text-muted-foreground mt-1">Performance analysis and league standings</p>
          </div>
          
          <div className="w-48">
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023/24">2023/24 Season</SelectItem>
                <SelectItem value="2022/23">2022/23 Season</SelectItem>
                <SelectItem value="2021/22">2021/22 Season</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* View Selector */}
        <Tabs value={statView} onValueChange={(value) => setStatView(value as LeagueStatView)}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Trophy size={16} />
              <span className="hidden sm:inline">League Table</span>
              <span className="sm:hidden">Table</span>
            </TabsTrigger>
            <TabsTrigger value="attacking" className="flex items-center gap-2">
              <LineChartIcon size={16} />
              <span className="hidden sm:inline">Attacking Stats</span>
              <span className="sm:hidden">Attack</span>
            </TabsTrigger>
            <TabsTrigger value="defensive" className="flex items-center gap-2">
              <BarChart2 size={16} />
              <span className="hidden sm:inline">Defensive Stats</span>
              <span className="sm:hidden">Defense</span>
            </TabsTrigger>
            <TabsTrigger value="possession" className="flex items-center gap-2">
              <ScatterChartIcon size={16} />
              <span className="hidden sm:inline">Possession Stats</span>
              <span className="sm:hidden">Possession</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <div className="bg-card border rounded-lg p-6 mb-8">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary"
                        onClick={() => handleSort('points')}
                      >
                        <div className="flex items-center gap-1">
                          <span>PTS</span>
                          {sortKey === 'points' && (
                            <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-center">P</TableHead>
                      <TableHead className="text-center">W</TableHead>
                      <TableHead className="text-center">D</TableHead>
                      <TableHead className="text-center">L</TableHead>
                      <TableHead className="text-center">GF</TableHead>
                      <TableHead className="text-center">GA</TableHead>
                      <TableHead 
                        className="text-center cursor-pointer hover:text-primary"
                        onClick={() => handleSort('gd')}
                      >
                        <div className="flex items-center gap-1 justify-center">
                          <span>GD</span>
                          {sortKey === 'gd' && (
                            <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="text-center cursor-pointer hover:text-primary"
                        onClick={() => handleSort('xG')}
                      >
                        <div className="flex items-center gap-1 justify-center">
                          <span>xG</span>
                          {sortKey === 'xG' && (
                            <span className="text-primary">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-center">Last 5</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTeams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.position}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-muted rounded-full"></div>
                            <span>{team.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold">{team.points}</TableCell>
                        <TableCell className="text-center">{team.played}</TableCell>
                        <TableCell className="text-center">{team.won}</TableCell>
                        <TableCell className="text-center">{team.drawn}</TableCell>
                        <TableCell className="text-center">{team.lost}</TableCell>
                        <TableCell className="text-center">{team.gf}</TableCell>
                        <TableCell className="text-center">{team.ga}</TableCell>
                        <TableCell className="text-center">{team.gd}</TableCell>
                        <TableCell className="text-center">{team.xG.toFixed(1)}</TableCell>
                        <TableCell>
                          <div className="flex gap-0.5">
                            {team.form.split('').map((result, index) => (
                              <span key={index} className={cn(
                                "w-5 h-5 flex items-center justify-center text-[10px] rounded-sm font-bold",
                                result === 'W' ? "bg-green-500 text-white" :
                                result === 'D' ? "bg-amber-500 text-white" :
                                "bg-red-500 text-white"
                              )}>
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
            </div>
          </TabsContent>
          
          <TabsContent value="attacking">
            <div className="bg-card border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">xG vs. Goals Scored</h2>
              <div className="h-[400px]">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={xgVsGoalsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="xG" name="Expected Goals (xG)" fill="#3b82f6" />
                      <Bar dataKey="goals" name="Actual Goals" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Goal Difference vs. xG</h3>
                <div className="h-[300px]">
                  <ChartContainer config={{}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={xgVsGoalsData.sort((a, b) => b.difference - a.difference)}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={40} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="difference" name="Goals - xG">
                          {xgVsGoalsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="defensive">
            <div className="bg-card border rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Defensive Strength Ranking</h2>
              <div className="h-[400px]">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={defensiveData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={40} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="cleanSheets" name="Clean Sheets" fill="#3b82f6" />
                      <Bar dataKey="goalsAgainst" name="Goals Against" fill="#ef4444" />
                      <Bar dataKey="xGA" name="Expected Goals Against" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="possession">
            <div className="bg-card border rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Possession vs. Pass Accuracy</h2>
                <div className="flex items-center gap-2">
                  <Filter size={16} />
                  <span className="text-sm font-medium">Position</span>
                </div>
              </div>
              <div className="h-[400px]">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid />
                      <XAxis 
                        type="number" 
                        dataKey="possession" 
                        name="Possession %" 
                        domain={[30, 70]}
                        label={{ value: 'Possession %', position: 'bottom' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="passAccuracy" 
                        name="Pass Accuracy %"
                        domain={[30, 90]}
                        label={{ value: 'Pass Accuracy %', angle: -90, position: 'left' }}
                      />
                      <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
                      <Scatter 
                        name="Teams" 
                        data={possessionData} 
                        fill="#8884d8"
                      >
                        {possessionData.map((entry, index) => {
                          // Color based on position - top teams are green, bottom are red
                          const fill = entry.position <= 6 
                            ? '#22c55e' 
                            : entry.position >= 15 
                              ? '#ef4444' 
                              : '#f59e0b';
                              
                          return <Cell key={`cell-${index}`} fill={fill} />;
                        })}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* AI Insights Panel */}
        <div className="bg-secondary/30 border border-secondary rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">AI League Insights</h2>
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="rounded-full bg-primary/10 text-primary p-1 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeagueStats;
