import React from 'react';
import { Card } from '@/types/game';
import UnoCard from './UnoCard';
import { cn } from '@/lib/utils';

interface PlayerHandProps {
  cards: Card[];
  onCardPlay: (card: Card) => void;
  isCurrentTurn: boolean;
  canPlayCard: (card: Card) => boolean;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  onCardPlay,
  isCurrentTurn,
  canPlayCard,
}) => {
  return (
    <div className="flex justify-center items-end h-32 relative">
      <div className="flex gap-2 px-4">
        {cards.map((card, index) => {
          const isPlayable = isCurrentTurn && canPlayCard(card);
          const rotation = (index - cards.length / 2) * 3;
          
          return (
            <div
              key={card.id || `${card.color}-${card.value}-${index}`}
              className={cn(
                'transition-all duration-300',
                isPlayable && 'hover:-translate-y-4'
              )}
              style={{
                transform: `rotate(${rotation}deg)`,
                zIndex: index,
              }}
            >
              <UnoCard
                card={card}
                onClick={() => isPlayable && onCardPlay(card)}
                disabled={!isPlayable}
                isPlayable={isPlayable}
                size="medium"
                className={cn(
                  isPlayable && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerHand;