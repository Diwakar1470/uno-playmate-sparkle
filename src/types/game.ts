export interface Card {
  color: 'red' | 'yellow' | 'green' | 'blue' | 'wild';
  value: string;
  id?: string;
}

export interface Player {
  id: string;
  username: string;
  cards: Card[];
  score: number;
  isCurrentTurn: boolean;
  hasCalledUno: boolean;
  avatar?: string;
  language?: 'python' | 'java' | 'c';
}

export interface GameState {
  roomId: string;
  roomName: string;
  players: Player[];
  currentPlayer: string;
  discardPile: Card[];
  direction: 1 | -1;
  gameStatus: 'waiting' | 'playing' | 'finished';
  winner?: string;
  timeRemaining: number;
  turnTimeRemaining: number;
}

export interface Challenge {
  id: string;
  prompt_start: string;
  prompt_end: string;
  answer: string;
  difficulty?: 'easy' | 'intermediate' | 'difficult';
}

export interface GameRoom {
  pin: string;
  name: string;
  admin: string;
  players: Player[];
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
}