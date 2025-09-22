import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Player } from '@/types/game';
import { generateBotName } from '@/utils/gameLogic';
import { toast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { roomPin } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomName] = useState(localStorage.getItem('roomName') || 'Game Room');

  useEffect(() => {
    // Simulate players joining
    const interval = setInterval(() => {
      setPlayers(prev => {
        if (prev.length >= 4) return prev;
        const newPlayer: Player = {
          id: `player-${prev.length + 1}`,
          username: generateBotName(),
          cards: [],
          score: Math.floor(Math.random() * 100),
          isCurrentTurn: false,
          hasCalledUno: false,
          language: 'python',
        };
        return [...prev, newPlayer];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleStartGame = () => {
    if (players.length < 3) {
      toast({
        title: "Not enough players",
        description: "Need at least 3 players to start",
        variant: "destructive",
      });
      return;
    }
    navigate(`/game/${roomPin}`);
  };

  const copyPin = () => {
    navigator.clipboard.writeText(roomPin || '');
    toast({
      title: "PIN Copied!",
      description: "Share it with your players",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-orbitron text-4xl font-bold gradient-primary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <h2 className="text-2xl text-muted-foreground">{roomName}</h2>
        </div>

        <Card className="glassmorphism border-secondary/30">
          <CardHeader>
            <CardTitle>Room PIN</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="font-orbitron text-4xl font-bold text-secondary">{roomPin}</div>
              <Button onClick={copyPin} variant="outline">Copy PIN</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="glassmorphism border-primary/30">
            <CardHeader>
              <CardTitle>Players ({players.length}/11)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {players.map(player => (
                  <div key={player.id} className="flex justify-between items-center p-2 rounded bg-background/50">
                    <span>{player.username}</span>
                    <span className="text-sm text-muted-foreground">Score: {player.score}</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleStartGame}
                disabled={players.length < 3}
                className="w-full mt-4 bg-primary hover:bg-primary/80"
              >
                Start Game ({players.length < 3 ? `Need ${3 - players.length} more` : 'Ready!'})
              </Button>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/30">
            <CardHeader>
              <CardTitle>Game History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No games played yet</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;