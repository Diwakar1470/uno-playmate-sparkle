import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { generateRoomPin } from '@/utils/gameLogic';
import { toast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState('');
  const [roomPin, setRoomPin] = useState('');
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('python');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room name",
        variant: "destructive",
      });
      return;
    }

    const newPin = generateRoomPin();
    localStorage.setItem('roomPin', newPin);
    localStorage.setItem('roomName', roomName);
    localStorage.setItem('isAdmin', 'true');
    
    navigate(`/admin/${newPin}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomPin.trim() || !username.trim()) {
      toast({
        title: "Error",
        description: "Please enter both room PIN and username",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('roomPin', roomPin);
    localStorage.setItem('username', username);
    localStorage.setItem('language', language);
    localStorage.setItem('isAdmin', 'false');
    
    navigate(`/waiting/${roomPin}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <h1 className="font-orbitron text-6xl font-bold">
            <span className="gradient-primary bg-clip-text text-transparent">Code</span>
            <span className="text-accent">UNO</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Where coding meets card gaming! Solve challenges, earn special cards, dominate the game.
          </p>
        </div>

        {/* Game Cards */}
        <div className="flex justify-center gap-4 mb-8">
          {['red', 'yellow', 'green', 'blue'].map((color, index) => (
            <div
              key={color}
              className={`w-16 h-24 rounded-lg border-2 shadow-card animate-float flex items-center justify-center
                ${color === 'red' ? 'bg-red-500 border-red-600' : ''}
                ${color === 'yellow' ? 'bg-yellow-400 border-yellow-500' : ''}
                ${color === 'green' ? 'bg-green-500 border-green-600' : ''}
                ${color === 'blue' ? 'bg-blue-500 border-blue-600' : ''}
              `}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <span className="font-orbitron font-bold text-white text-2xl drop-shadow">
                {index + 1}
              </span>
            </div>
          ))}
        </div>

        {/* Login Forms */}
        <Tabs defaultValue="join" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glassmorphism">
            <TabsTrigger value="join" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Join Game
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              Create Room
            </TabsTrigger>
          </TabsList>

          <TabsContent value="join">
            <Card className="glassmorphism border-primary/30">
              <CardHeader>
                <CardTitle className="font-orbitron">Join Existing Game</CardTitle>
                <CardDescription>Enter the room PIN to join your friends</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomPin">Room PIN</Label>
                    <Input
                      id="roomPin"
                      type="text"
                      placeholder="Enter 6-digit PIN"
                      value={roomPin}
                      onChange={(e) => setRoomPin(e.target.value)}
                      maxLength={6}
                      className="font-orbitron text-lg text-center bg-background/50 border-primary/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-background/50 border-primary/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="bg-background/50 border-primary/30">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java (Coming Soon)</SelectItem>
                        <SelectItem value="c">C (Coming Soon)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/80 font-orbitron">
                    Join Game
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="glassmorphism border-secondary/30">
              <CardHeader>
                <CardTitle className="font-orbitron">Create New Room</CardTitle>
                <CardDescription>Start a new game and invite your friends</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomName">Room Name</Label>
                    <Input
                      id="roomName"
                      type="text"
                      placeholder="e.g., Friday Night CodeUNO"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="bg-background/50 border-secondary/30"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-secondary hover:bg-secondary/80 font-orbitron">
                    Create Room
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="glassmorphism border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">🎮</span> Classic UNO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All the classic UNO rules you know and love
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">💻</span> Code Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Solve Python challenges to earn special cards
              </p>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">🏆</span> Leaderboards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Compete with friends and climb the rankings
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;