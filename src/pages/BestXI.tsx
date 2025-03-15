
import React from 'react';
import BestXISection from '@/components/BestXI/BestXISection';
import { mockData, generateBestXI } from '@/utils/mockData';
import GlassCard from '@/components/ui-custom/GlassCard';

const BestXI = () => {
  const handleGenerateTeam = (formationName: string, budget: number) => {
    const formation = mockData.formations.find(f => f.name === formationName);
    if (!formation) return [];
    
    // Filter players by budget
    const affordablePlayers = mockData.players.filter(p => Number(p.price) <= budget / 11);
    return generateBestXI(affordablePlayers, formation);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Best XI Recommendation
            </h1>
            <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
              Get AI-powered suggestions for your optimal fantasy team lineup based on form, fixtures, and statistics.
            </p>
          </div>
          
          {/* Main Content */}
          <div className="space-y-8">
            <BestXISection
              players={mockData.players}
              onGenerateTeam={handleGenerateTeam}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestXI;
