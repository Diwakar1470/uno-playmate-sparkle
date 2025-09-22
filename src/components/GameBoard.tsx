import React, { useState, useEffect } from 'react';
import { Card, Player, GameState } from '@/types/game';
import UnoCard from './UnoCard';
import PlayerHand from './PlayerHand';
import OpponentHand from './OpponentHand';
import ChallengeModal from './ChallengeModal';
import { Button } from '@/components/ui/button';
import { canPlayCard, getNextPlayer } from '@/utils/gameLogic';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface GameBoardProps {
  gameState: GameState;
  currentPlayer: Player;
  onCardPlay: (card: Card) => void;
  onDrawCard: () => void;
  onCallUno: () => void;
  onColorSelect: (color: string) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  currentPlayer,
  onCardPlay,
  onDrawCard,
  onCallUno,
  onColorSelect,
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeType, setChallengeType] = useState<string>('');
  const [challengeDifficulty, setChallengeDifficulty] = useState<'easy' | 'intermediate' | 'difficult'>('easy');
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const topCard = gameState.discardPile[gameState.discardPile.length - 1];
  const opponents = gameState.players.filter(p => p.id !== currentPlayer.id);

  const handleCardPlay = (card: Card) => {
    if (card.color === 'wild') {
      // Show color selection
      setSelectedColor(null);
    } else {
      onCardPlay(card);
    }
  };

  const handleColorSelection = (color: string) => {
    setSelectedColor(color);
    setActiveColor(color);
    onColorSelect(color);
  };

  const canPlay = (card: Card) => {
    return canPlayCard(card, topCard, activeColor || undefined);
  };

  const handleChallengeRequest = (type: string) => {
    setChallengeType(type);
    
    // Set difficulty based on card type
    if (type === 'Wild Draw Four') {
      setChallengeDifficulty('difficult');
    } else if (type === 'Draw Two' || type === 'Reverse') {
      setChallengeDifficulty('intermediate');
    } else {
      setChallengeDifficulty('easy');
    }
    
    setShowChallengeModal(true);
  };

  const handleChallengeSuccess = () => {
    setShowChallengeModal(false);
    toast({
      title: "Challenge Completed!",
      description: `You earned a ${challengeType} card!`,
    });
    // In a real implementation, this would add the card to the player's hand
  };

  // Position opponents around the table
  const getOpponentPosition = (index: number): 'top' | 'left' | 'right' => {
    if (opponents.length === 1) return 'top';
    if (opponents.length === 2) {
      return index === 0 ? 'left' : 'right';
    }
    return ['left', 'top', 'right'][index % 3] as 'top' | 'left' | 'right';
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-background via-background to-primary/10 overflow-hidden">
      {/* Game Timer */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 glassmorphism px-6 py-2 rounded-full">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">Game Time:</span>
          <span className="font-orbitron font-bold text-xl text-primary">
            {Math.floor(gameState.timeRemaining / 60)}:{(gameState.timeRemaining % 60).toString().padStart(2, '0')}
          </span>
          {currentPlayer.isCurrentTurn && (
            <>
              <span className="text-muted-foreground">Turn:</span>
              <span className="font-orbitron font-bold text-xl text-accent">
                {gameState.turnTimeRemaining}s
              </span>
            </>
          )}
        </div>
      </div>

      {/* Opponents */}
      {opponents.map((opponent, index) => (
        <OpponentHand
          key={opponent.id}
          player={opponent}
          position={getOpponentPosition(index)}
        />
      ))}

      {/* Game Table */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center gap-8">
          {/* Draw Pile */}
          <div
            onClick={currentPlayer.isCurrentTurn ? onDrawCard : undefined}
            className={cn(
              "relative cursor-pointer transition-all",
              currentPlayer.isCurrentTurn && "hover:scale-105"
            )}
          >
            <div className="absolute -inset-2 bg-primary/20 rounded-lg blur-lg"></div>
            <UnoCard
              card={{ color: 'wild', value: 'back' }}
              faceDown
              size="large"
            />
            <div className="absolute -bottom-6 text-center w-full">
              <span className="text-xs text-muted-foreground">Draw Pile</span>
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            <div className="absolute -inset-2 bg-accent/20 rounded-lg blur-lg animate-pulse-glow"></div>
            {topCard && (
              <UnoCard
                card={topCard}
                size="large"
                className="shadow-glow"
              />
            )}
            {activeColor && topCard.color === 'wild' && (
              <div className={cn(
                "absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white",
                activeColor === 'red' && 'bg-red-500',
                activeColor === 'yellow' && 'bg-yellow-400',
                activeColor === 'green' && 'bg-green-500',
                activeColor === 'blue' && 'bg-blue-500'
              )}>
                Active: {activeColor.toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-6 text-center w-full">
              <span className="text-xs text-muted-foreground">Discard Pile</span>
            </div>
          </div>
        </div>

        {/* Color Selection for Wild Cards */}
        {selectedColor === null && topCard?.color === 'wild' && (
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 glassmorphism p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Select a color:</p>
            <div className="flex gap-2">
              {['red', 'yellow', 'green', 'blue'].map(color => (
                <button
                  key={color}
                  onClick={() => handleColorSelection(color)}
                  className={cn(
                    "w-12 h-12 rounded-lg border-2 transition-all hover:scale-110",
                    color === 'red' && 'bg-red-500 border-red-600',
                    color === 'yellow' && 'bg-yellow-400 border-yellow-500',
                    color === 'green' && 'bg-green-500 border-green-600',
                    color === 'blue' && 'bg-blue-500 border-blue-600'
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Challenge Buttons */}
      <div className="absolute bottom-48 left-1/2 -translate-x-1/2">
        <div className="glassmorphism rounded-lg p-2">
          <p className="text-xs text-muted-foreground text-center mb-2">Request Special Cards</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleChallengeRequest('Wild Draw Four')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              +4
            </Button>
            <Button
              size="sm"
              onClick={() => handleChallengeRequest('Draw Two')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              +2
            </Button>
            <Button
              size="sm"
              onClick={() => handleChallengeRequest('Reverse')}
              className="bg-green-600 hover:bg-green-700"
            >
              ⟲
            </Button>
            <Button
              size="sm"
              onClick={() => handleChallengeRequest('Skip')}
              className="bg-red-600 hover:bg-red-700"
            >
              ⊘
            </Button>
            <Button
              size="sm"
              onClick={() => handleChallengeRequest('Wild')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              🎨
            </Button>
          </div>
        </div>
      </div>

      {/* Player Hand */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl">
        <PlayerHand
          cards={currentPlayer.cards}
          onCardPlay={handleCardPlay}
          isCurrentTurn={currentPlayer.isCurrentTurn}
          canPlayCard={canPlay}
        />
        
        {/* UNO Button */}
        {currentPlayer.cards.length === 2 && !currentPlayer.hasCalledUno && (
          <div className="absolute -top-12 right-8">
            <Button
              onClick={onCallUno}
              className="bg-accent hover:bg-accent/80 animate-pulse-glow font-orbitron font-bold text-lg px-6 py-3"
            >
              UNO!
            </Button>
          </div>
        )}

        {/* Player Info */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-sm text-muted-foreground">
            {currentPlayer.username} • {currentPlayer.cards.length} cards • Score: {currentPlayer.score}
          </p>
        </div>
      </div>

      {/* Challenge Modal */}
      <ChallengeModal
        isOpen={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        onSuccess={handleChallengeSuccess}
        difficulty={challengeDifficulty}
        cardType={challengeType}
      />
    </div>
  );
};

export default GameBoard;