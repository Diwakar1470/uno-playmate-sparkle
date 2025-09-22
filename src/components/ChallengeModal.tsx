import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Challenge } from '@/types/game';
import { cn } from '@/lib/utils';
import challenges from '@/data/challenges.json';

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  difficulty: 'easy' | 'intermediate' | 'difficult';
  cardType: string;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  difficulty,
  cardType,
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Select a random challenge
      const pythonChallenges = challenges.python as Challenge[];
      const randomChallenge = pythonChallenges[Math.floor(Math.random() * pythonChallenges.length)];
      setCurrentChallenge(randomChallenge);
      setUserAnswer('');
      setIsCorrect(null);
      setTimeRemaining(30);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && isOpen) {
      handleSubmit();
    }
  }, [timeRemaining, isOpen]);

  const handleSubmit = () => {
    if (!currentChallenge) return;
    
    const correct = userAnswer.trim() === currentChallenge.answer;
    setIsCorrect(correct);
    
    if (correct) {
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  if (!currentChallenge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-primary/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-2xl gradient-primary bg-clip-text text-transparent">
            Coding Challenge - {cardType}
          </DialogTitle>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">Difficulty: {difficulty.toUpperCase()}</span>
            <span className={cn(
              "text-sm font-bold",
              timeRemaining > 10 ? 'text-green-400' : 'text-red-400'
            )}>
              Time: {timeRemaining}s
            </span>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-black/50 rounded-lg p-4 font-mono">
            <pre className="text-green-400">{currentChallenge.prompt_start}</pre>
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="my-2 bg-gray-900 border-gray-700 text-yellow-400 font-mono"
              placeholder="Type your answer here..."
              disabled={isCorrect !== null}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <pre className="text-green-400">{currentChallenge.prompt_end}</pre>
          </div>
          
          {isCorrect !== null && (
            <div className={cn(
              "text-center font-bold text-lg animate-pulse-glow",
              isCorrect ? 'text-green-400' : 'text-red-400'
            )}>
              {isCorrect ? '✓ Correct! Card earned!' : '✗ Incorrect! Try again next time.'}
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isCorrect !== null}
              className="flex-1 bg-primary hover:bg-primary/80"
            >
              Submit Answer
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-primary/50 hover:bg-primary/20"
            >
              Skip Challenge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeModal;