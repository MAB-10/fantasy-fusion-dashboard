import React from 'react';
import { Player, Position, Formation } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface FormationViewProps {
  players: Player[];
  formation: Formation;
  onSelectPlayer?: (player: Player) => void;
  selectedPlayerId?: number;
}

const FormationView: React.FC<FormationViewProps> = ({ 
  players, 
  formation,
  onSelectPlayer,
  selectedPlayerId
}) => {
  // Organize players by position
  const playersByPosition: Record<Position, Player[]> = {
    GK: players.filter(p => p.position === 'GK'),
    DEF: players.filter(p => p.position === 'DEF'),
    MID: players.filter(p => p.position === 'MID'),
    FWD: players.filter(p => p.position === 'FWD'),
  };
  
  const renderPlayerDot = (player: Player, index: number) => {
    const positionColors = {
      GK: 'bg-amber-500 border-amber-600',
      DEF: 'bg-blue-500 border-blue-600',
      MID: 'bg-green-500 border-green-600',
      FWD: 'bg-red-500 border-red-600',
    };
    
    const isSelected = selectedPlayerId === player.id;
    
    return (
      <button
        key={player.id}
        onClick={() => onSelectPlayer && onSelectPlayer(player)}
        className={cn(
          "relative flex flex-col items-center transition-all duration-300 transform group",
          isSelected ? "scale-110" : "hover:scale-105"
        )}
      >
        <div 
          className={cn(
            "w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            positionColors[player.position],
            isSelected ? "ring-4 ring-white/30" : ""
          )}
        >
          <span className="text-white font-bold text-xl">{player.name.charAt(0)}</span>
        </div>
        <div className={cn(
          "absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-all duration-300",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          {player.name}
        </div>
      </button>
    );
  };
  
  return (
    <div className="relative w-full aspect-[2/3] bg-football-grass rounded-xl overflow-hidden transform perspective-1000 transition-all duration-500 hover:rotate-x-1">
      {/* Field markings */}
      <div className="absolute inset-0 flex flex-col">
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-full" />
        
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 transform -translate-y-1/2" />
        
        {/* Penalty areas */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/5 h-1/5 border-b-2 border-x-2 border-white/30" />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/5 h-1/5 border-t-2 border-x-2 border-white/30" />
        
        {/* Goal areas */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1/10 border-b-2 border-x-2 border-white/30" />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-1/10 border-t-2 border-x-2 border-white/30" />
      </div>
      
      {/* Players */}
      <div className="absolute inset-0 flex flex-col">
        {/* Goalkeeper */}
        <div className="flex-1 flex items-end justify-center pb-4">
          {playersByPosition.GK.slice(0, formation.positions.GK).map((player, index) => 
            renderPlayerDot(player, index)
          )}
        </div>
        
        {/* Defenders */}
        <div className="flex-1 flex items-center justify-around px-8">
          {playersByPosition.DEF.slice(0, formation.positions.DEF).map((player, index) => 
            renderPlayerDot(player, index)
          )}
        </div>
        
        {/* Midfielders */}
        <div className="flex-1 flex items-center justify-around px-8">
          {playersByPosition.MID.slice(0, formation.positions.MID).map((player, index) => 
            renderPlayerDot(player, index)
          )}
        </div>
        
        {/* Forwards */}
        <div className="flex-1 flex items-start justify-around pt-4 px-8">
          {playersByPosition.FWD.slice(0, formation.positions.FWD).map((player, index) => 
            renderPlayerDot(player, index)
          )}
        </div>
      </div>
      
      {/* Formation name */}
      <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
        {formation.name}
      </div>
    </div>
  );
};

export default FormationView;
