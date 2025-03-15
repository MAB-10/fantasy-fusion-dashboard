
import React from 'react';
import { Player } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/ui-custom/GlassCard';
import Chip from '@/components/ui-custom/Chip';
import { Star, Percent, Clock } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  index?: number;
  isHighlighted?: boolean;
  showDetailedStats?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  index, 
  isHighlighted = false,
  showDetailedStats = false
}) => {
  const positionColors = {
    GK: 'bg-amber-500',
    DEF: 'bg-blue-500',
    MID: 'bg-green-500',
    FWD: 'bg-red-500',
  };
  
  const positionText = {
    GK: 'Goalkeeper',
    DEF: 'Defender',
    MID: 'Midfielder',
    FWD: 'Forward',
  };
  
  const renderStatBar = (value: number, max: number = 100, colorClass: string = 'bg-primary') => (
    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${colorClass} rounded-full transition-all duration-1000`}
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  );
  
  return (
    <GlassCard
      className={cn(
        "w-full transition-all duration-300 overflow-hidden",
        isHighlighted && "ring-2 ring-primary",
        index !== undefined && "animate-scale-in",
        index !== undefined && `animation-delay-${index * 100}`
      )}
      hover
    >
      <div className="flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Chip 
              variant="primary" 
              size="sm" 
              className={cn("mb-2", positionColors[player.position] + "/10")}
            >
              {positionText[player.position]}
            </Chip>
            <h3 className="font-semibold text-lg tracking-tight">{player.name}</h3>
            <p className="text-sm text-foreground/70">{player.team}</p>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded text-sm font-medium">
              £{player.price}m
            </div>
            <div className="flex items-center mt-2 text-amber-500">
              <Star size={16} className="mr-1" fill="currentColor" />
              <span className="font-semibold">{player.form}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
            <span className="text-xs text-foreground/70">Points</span>
            <span className="font-semibold">{player.totalPoints}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
            <span className="text-xs text-foreground/70">Goals</span>
            <span className="font-semibold">{player.goals}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-secondary/50">
            <span className="text-xs text-foreground/70">Assists</span>
            <span className="font-semibold">{player.assists}</span>
          </div>
        </div>
        
        {showDetailedStats && (
          <>
            <div className="space-y-2 my-2">
              <div className="flex justify-between items-center text-sm">
                <span>Form</span>
                <span className="font-medium">{player.form}</span>
              </div>
              {renderStatBar(player.form, 10, 'bg-amber-500')}
              
              {player.position !== 'GK' && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span>Shot Accuracy</span>
                    <span className="font-medium">{player.shotAccuracy}%</span>
                  </div>
                  {renderStatBar(player.shotAccuracy || 0, 100, 'bg-blue-500')}
                </>
              )}
              
              <div className="flex justify-between items-center text-sm">
                <span>Passing Accuracy</span>
                <span className="font-medium">{player.passingAccuracy}%</span>
              </div>
              {renderStatBar(player.passingAccuracy || 0, 100, 'bg-green-500')}
              
              {player.position === 'GK' && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span>Saves</span>
                    <span className="font-medium">{player.saves}</span>
                  </div>
                  {renderStatBar(player.saves || 0, 100, 'bg-purple-500')}
                </>
              )}
              
              {player.position !== 'GK' && player.position !== 'FWD' && (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span>Tackles</span>
                    <span className="font-medium">{player.tackles}</span>
                  </div>
                  {renderStatBar(player.tackles || 0, 100, 'bg-red-500')}
                </>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-3 text-xs text-foreground/70">
              <div className="flex items-center">
                <Percent size={14} className="mr-1" />
                <span>{player.selected}% selected</span>
              </div>
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{Math.floor(player.minutesPlayed / 90)} matches</span>
              </div>
            </div>
          </>
        )}
        
        {!showDetailedStats && (
          <div className="flex justify-between items-center mt-3 text-xs text-foreground/70">
            <div>Next: {player.nextFixture}</div>
            <div className="flex items-center">
              <Percent size={14} className="mr-1" />
              <span>{player.selected}% selected</span>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default PlayerCard;
