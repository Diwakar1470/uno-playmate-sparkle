import React from 'react';
import { Player } from '@/types/game';
import { cn } from '@/lib/utils';

interface OpponentHandProps {
  player: Player;
  position: 'top' | 'left' | 'right';
}

const OpponentHand: React.FC<OpponentHandProps> = ({ player, position }) => {
  const positionClasses = {
    top: 'top-4 left-1/2 -translate-x-1/2 flex-row',
    left: 'left-4 top-1/2 -translate-y-1/2 flex-col',
    right: 'right-4 top-1/2 -translate-y-1/2 flex-col',
  };

  const cardOrientation = {
    top: 'w-8 h-12',
    left: 'w-12 h-8 rotate-90',
    right: 'w-12 h-8 -rotate-90',
  };

  return (
    <div className={cn('absolute flex items-center gap-2', positionClasses[position])}>
      <div className="glassmorphism rounded-lg p-2 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {player.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="text-white">
            <p className="text-sm font-semibold">{player.username}</p>
            <p className="text-xs text-muted-foreground">
              {player.cards.length} cards
            </p>
          </div>
        </div>
        
        {player.isCurrentTurn && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
        )}
        
        {player.hasCalledUno && player.cards.length === 1 && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse-glow">
            UNO!
          </div>
        )}
        
        <div className={cn('flex gap-0.5', position === 'top' ? 'flex-row' : 'flex-col')}>
          {player.cards.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={cn(
                'gradient-card-back rounded border border-gray-700',
                cardOrientation[position]
              )}
              style={{
                marginLeft: position === 'top' ? '-4px' : '0',
                marginTop: position !== 'top' ? '-4px' : '0',
              }}
            />
          ))}
          {player.cards.length > 5 && (
            <div className="text-xs text-muted-foreground ml-1">
              +{player.cards.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpponentHand;