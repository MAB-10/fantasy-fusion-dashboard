
import React, { useState, useEffect } from 'react';
import { Player, Formation, formations } from '@/utils/mockData';
import GlassCard from '@/components/ui-custom/GlassCard';
import Chip from '@/components/ui-custom/Chip';
import FormationView from './FormationView';
import PlayerCard from './PlayerCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ChevronDown, RotateCcw, Info } from 'lucide-react';

interface BestXIProps {
  players: Player[];
  onGenerateTeam: (formationName: string, budget: number) => Player[];
  initialFormation?: Formation;
  initialBudget?: number;
}

const BestXISection: React.FC<BestXIProps> = ({ 
  players, 
  onGenerateTeam,
  initialFormation = formations[0],
  initialBudget = 100
}) => {
  const [selectedFormation, setSelectedFormation] = useState<Formation>(initialFormation);
  const [budget, setBudget] = useState<number>(initialBudget);
  const [bestXI, setBestXI] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [justification, setJustification] = useState<string>('');
  
  // Generate AI just ification for player selection
  const generateJustification = (player: Player) => {
    const reasons = [
      `${player.name} has been in excellent form, scoring ${player.goals} goals and providing ${player.assists} assists.`,
      `With ${player.totalPoints} total points and an impressive form rating of ${player.form}, ${player.name} is a reliable choice.`,
      `Selected by ${player.selected}% of managers, ${player.name} has proven to be a popular and effective choice in their position.`,
      `${player.name}'s consistent performance and upcoming fixture against ${player.nextFixture} makes them a strong pick.`,
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  };
  
  useEffect(() => {
    const team = onGenerateTeam(selectedFormation.name, budget);
    setBestXI(team);
  }, [selectedFormation, budget, onGenerateTeam]);
  
  const handlePlayerSelect = (player: Player) => {
    setSelectedPlayer(player);
    setJustification(generateJustification(player));
  };
  
  const totalCost = bestXI.reduce((sum, player) => sum + Number(player.price), 0);
  
  return (
    <div className="space-y-6">
      {/* Settings Panel */}
      <GlassCard className="relative overflow-hidden">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-4">
            <h3 className="font-semibold">Team Settings</h3>
            <div className="flex gap-2">
              <Chip variant="primary" size="sm">
                Budget: £{budget}m
              </Chip>
              <Chip variant="info" size="sm">
                Formation: {selectedFormation.name}
              </Chip>
            </div>
          </div>
          <ChevronDown 
            className={cn(
              "transition-transform duration-300",
              isSettingsOpen ? "rotate-180" : ""
            )} 
          />
        </button>
        
        <div
          className={cn(
            "transition-all duration-300 origin-top",
            isSettingsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="p-4 pt-0 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Formation</label>
              <Select
                value={selectedFormation.name}
                onValueChange={(value) => {
                  const formation = formations.find(f => f.name === value);
                  if (formation) setSelectedFormation(formation);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select formation" />
                </SelectTrigger>
                <SelectContent>
                  {formations.map((formation) => (
                    <SelectItem key={formation.name} value={formation.name}>
                      {formation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Budget (£m)</label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[budget]}
                  onValueChange={(value) => setBudget(value[0])}
                  min={50}
                  max={150}
                  step={1}
                  className="flex-1"
                />
                <span className="min-w-[4rem] text-right font-medium">
                  £{budget}m
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Info size={14} className="mr-1" />
                Total cost: £{totalCost.toFixed(1)}m
              </div>
              <button
                onClick={() => {
                  setBudget(initialBudget);
                  setSelectedFormation(initialFormation);
                }}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Formation View */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative">
          <FormationView
            players={bestXI}
            formation={selectedFormation}
            onSelectPlayer={handlePlayerSelect}
            selectedPlayerId={selectedPlayer?.id}
          />
        </div>
        
        {/* Selected Player Card */}
        <div className="space-y-4">
          {selectedPlayer ? (
            <>
              <PlayerCard 
                player={selectedPlayer} 
                isHighlighted
                showDetailedStats
              />
              <GlassCard variant="accent" className="animate-fade-in">
                <h4 className="font-medium mb-2">AI Justification</h4>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {justification}
                </p>
              </GlassCard>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div className="text-foreground/60">
                <p className="mb-2 font-medium">Select a player to see detailed stats</p>
                <p className="text-sm">Click on any player in the formation view to see their detailed statistics and selection justification.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestXISection;
