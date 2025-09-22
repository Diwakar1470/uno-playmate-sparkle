import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/game';
import { generateBotName } from '@/utils/gameLogic';
import { cn } from '@/lib/utils';

const WaitingRoom: React.FC = () => {
  const { roomPin } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomName] = useState(localStorage.getItem('roomName') || 'Game Room');
  const [username] = useState(localStorage.getItem('username') || 'Player');
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    // Initialize with current player
    const currentPlayer: Player = {
      id: '1',
      username: username,
      cards: [],
      score: 0,
      isCurrentTurn: false,
      hasCalledUno: false,
      language: (localStorage.getItem('language') || 'python') as 'python',
    };
    
    // Add some bot players for demonstration
    const bots: Player[] = Array.from({ length: 3 }, (_, i) => ({
      id: `bot-${i + 1}`,
      username: generateBotName(),
      cards: [],
      score: 0,
      isCurrentTurn: false,
      hasCalledUno: false,
      language: 'python',
    }));

    setPlayers([currentPlayer, ...bots]);

    // Simulate admin starting the game after 5 seconds
    setTimeout(() => {
      setCountdown(3);
    }, 5000);
  }, [username]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      navigate(`/game/${roomPin}`);
    }
  }, [countdown, navigate, roomPin]);

  const avatarColors = [
    'from-red-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-purple-500 to-pink-500',
    'from-indigo-500 to-blue-500',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-6xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-orbitron text-4xl font-bold text-primary">
            {roomName}
          </h1>
          <div className="flex justify-center items-center gap-4">
            <div className="glassmorphism px-6 py-2 rounded-full">
              <span className="text-muted-foreground">Room PIN: </span>
              <span className="font-orbitron font-bold text-xl text-accent">{roomPin}</span>
            </div>
            <div className="glassmorphism px-6 py-2 rounded-full">
              <span className="text-muted-foreground">Players: </span>
              <span className="font-bold text-xl text-primary">{players.length}/11</span>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {players.map((player, index) => (
            <Card
              key={player.id}
              className={cn(
                "glassmorphism border-primary/30 p-6 transition-all hover:scale-105",
                "animate-fade-in",
                player.username === username && "ring-2 ring-primary"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className={cn(
                  "w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-2xl font-bold shadow-lg",
                  avatarColors[index % avatarColors.length]
                )}>
                  {player.username.charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg">{player.username}</p>
                  {player.username === username && (
                    <span className="text-xs text-primary">(You)</span>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {player.language?.toUpperCase() || 'PYTHON'}
                  </p>
                </div>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-2 h-2 rounded-full",
                        i === 0 ? "bg-green-500 animate-pulse" : "bg-gray-600"
                      )}
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}

          {/* Empty slots */}
          {[...Array(Math.max(0, 8 - players.length))].map((_, index) => (
            <Card
              key={`empty-${index}`}
              className="glassmorphism border-gray-700 p-6 opacity-30"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-600 text-4xl">?</span>
                </div>
                <p className="text-gray-600">Waiting...</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Status Message */}
        <div className="text-center">
          {countdown !== null ? (
            <div className="space-y-4">
              <h2 className="font-orbitron text-3xl font-bold text-accent animate-pulse-glow">
                Game Starting!
              </h2>
              <div className="font-orbitron text-6xl font-bold gradient-primary bg-clip-text text-transparent animate-bounce">
                {countdown}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <p className="text-xl text-muted-foreground">
                Waiting for the admin to start the game...
              </p>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-primary/30 hover:bg-primary/10"
              >
                Leave Room
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;