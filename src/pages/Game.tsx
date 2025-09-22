import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Player, GameState } from '@/types/game';
import { createDeck, generateBotName, calculateHandScore } from '@/utils/gameLogic';
import GameBoard from '@/components/GameBoard';
import { toast } from '@/hooks/use-toast';

const Game: React.FC = () => {
  const { roomPin } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Player';
  
  const [gameState, setGameState] = useState<GameState>(() => {
    const deck = createDeck();
    const players: Player[] = [
      {
        id: '1',
        username: username,
        cards: deck.slice(0, 7),
        score: 0,
        isCurrentTurn: true,
        hasCalledUno: false,
      },
      ...Array.from({ length: 3 }, (_, i) => ({
        id: `bot-${i + 1}`,
        username: generateBotName(),
        cards: deck.slice((i + 1) * 7, (i + 2) * 7),
        score: 0,
        isCurrentTurn: false,
        hasCalledUno: false,
      })),
    ];

    return {
      roomId: roomPin || '',
      roomName: localStorage.getItem('roomName') || 'Game Room',
      players,
      currentPlayer: players[0].id,
      discardPile: [deck[28]],
      direction: 1,
      gameStatus: 'playing' as const,
      timeRemaining: 1200,
      turnTimeRemaining: 30,
    };
  });

  const currentPlayer = gameState.players.find(p => p.username === username) || gameState.players[0];

  const handleCardPlay = (card: Card) => {
    toast({
      title: "Card Played!",
      description: `You played ${card.color} ${card.value}`,
    });
    
    setGameState(prev => ({
      ...prev,
      discardPile: [...prev.discardPile, card],
      players: prev.players.map(p =>
        p.id === currentPlayer.id
          ? { ...p, cards: p.cards.filter(c => c.id !== card.id) }
          : p
      ),
    }));
  };

  const handleDrawCard = () => {
    const deck = createDeck();
    const newCard = deck[0];
    
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.id === currentPlayer.id
          ? { ...p, cards: [...p.cards, newCard] }
          : p
      ),
    }));
    
    toast({
      title: "Card Drawn",
      description: "You drew a card from the deck",
    });
  };

  const handleCallUno = () => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.id === currentPlayer.id
          ? { ...p, hasCalledUno: true }
          : p
      ),
    }));
    
    toast({
      title: "UNO!",
      description: "You called UNO!",
    });
  };

  const handleColorSelect = (color: string) => {
    toast({
      title: "Color Selected",
      description: `Active color is now ${color}`,
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1),
        turnTimeRemaining: Math.max(0, prev.turnTimeRemaining - 1),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (gameState.timeRemaining === 0) {
    const winner = gameState.players.reduce((prev, current) =>
      calculateHandScore(prev.cards) < calculateHandScore(current.cards) ? prev : current
    );
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-orbitron text-4xl font-bold text-primary">Game Over!</h1>
          <p className="text-2xl">Winner: {winner.username}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <GameBoard
      gameState={gameState}
      currentPlayer={currentPlayer}
      onCardPlay={handleCardPlay}
      onDrawCard={handleDrawCard}
      onCallUno={handleCallUno}
      onColorSelect={handleColorSelect}
    />
  );
};

export default Game;