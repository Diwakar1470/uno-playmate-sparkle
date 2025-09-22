import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Challenge } from '@/types/game';
import { cn } from '@/lib/utils';
import { Timer, Code2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
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
  const [language, setLanguage] = useState<'python' | 'java' | 'c'>('python');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Randomly select a language
      const languages = ['python', 'java', 'c'] as const;
      const randomLang = languages[Math.floor(Math.random() * languages.length)];
      setLanguage(randomLang);
      
      // Select a random challenge from that language
      const languageChallenges = challenges[randomLang] as Challenge[];
      const randomChallenge = languageChallenges[Math.floor(Math.random() * languageChallenges.length)];
      setCurrentChallenge(randomChallenge);
      setUserAnswer('');
      setIsCorrect(null);
      
      // Set time based on difficulty
      const timeMap = { easy: 45, intermediate: 30, difficult: 20 };
      setTimeRemaining(timeMap[difficulty]);
      
      // Focus input after modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, difficulty]);

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

  // Split the prompt to show the blank
  const promptParts = currentChallenge.prompt_start.split('_________');
  const beforeBlank = promptParts[0];
  const afterBlank = promptParts[1] || '';

  const getLanguageColor = () => {
    switch(language) {
      case 'python': return 'from-blue-500 to-yellow-500';
      case 'java': return 'from-orange-500 to-red-500';
      case 'c': return 'from-gray-500 to-blue-500';
      default: return 'from-primary to-accent';
    }
  };

  const getLanguageLabel = () => {
    switch(language) {
      case 'python': return 'Python';
      case 'java': return 'Java';
      case 'c': return 'C';
      default: return 'Code';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-primary/20 max-w-3xl overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        
        <DialogHeader className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-xl bg-gradient-to-br shadow-glow",
                getLanguageColor()
              )}>
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {getLanguageLabel()} Challenge
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete the code to earn: {cardType}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                "bg-gradient-to-r",
                difficulty === 'easy' ? 'from-green-500/20 to-green-600/20 text-green-400' :
                difficulty === 'intermediate' ? 'from-yellow-500/20 to-yellow-600/20 text-yellow-400' :
                'from-red-500/20 to-red-600/20 text-red-400'
              )}>
                {difficulty.toUpperCase()}
              </div>
              
              <div className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full",
                "bg-gradient-to-r",
                timeRemaining > 10 ? 'from-green-500/20 to-green-600/20' : 
                timeRemaining > 5 ? 'from-yellow-500/20 to-yellow-600/20' :
                'from-red-500/20 to-red-600/20'
              )}>
                <Timer className={cn(
                  "w-3 h-3",
                  timeRemaining > 10 ? 'text-green-400' : 
                  timeRemaining > 5 ? 'text-yellow-400' : 'text-red-400'
                )} />
                <span className={cn(
                  "text-sm font-bold tabular-nums",
                  timeRemaining > 10 ? 'text-green-400' : 
                  timeRemaining > 5 ? 'text-yellow-400' : 'text-red-400'
                )}>
                  {timeRemaining}s
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 relative z-10">
          <div className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm rounded-xl p-6 border border-border/50 shadow-elevated">
            <div className="font-mono text-sm space-y-2">
              <pre className="text-muted-foreground whitespace-pre-wrap">
                <span className="text-primary">{beforeBlank}</span>
                <span className="inline-flex items-center">
                  <Input
                    ref={inputRef}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className={cn(
                      "inline-block w-32 h-7 mx-1 px-2",
                      "bg-background/50 border-primary/50",
                      "text-accent font-bold text-center",
                      "focus:border-primary focus:ring-1 focus:ring-primary/50",
                      "placeholder:text-muted-foreground/50",
                      "transition-all duration-200"
                    )}
                    placeholder="________"
                    disabled={isCorrect !== null}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </span>
                <span className="text-primary">{afterBlank}</span>
              </pre>
              {currentChallenge.prompt_end && (
                <pre className="text-muted-foreground whitespace-pre-wrap">{currentChallenge.prompt_end}</pre>
              )}
            </div>
          </div>
          
          {isCorrect !== null && (
            <div className={cn(
              "flex items-center justify-center gap-3 p-4 rounded-xl",
              "animate-scale-in",
              isCorrect 
                ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30' 
                : 'bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30'
            )}>
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-semibold">
                    Perfect! You earned the {cardType} card!
                  </span>
                  <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-400" />
                  <span className="text-red-400 font-semibold">
                    Not quite right. The answer was: {currentChallenge.answer}
                  </span>
                </>
              )}
            </div>
          )}
          
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isCorrect !== null || !userAnswer.trim()}
              className={cn(
                "flex-1 h-11 font-semibold",
                "bg-gradient-to-r from-primary to-primary/80",
                "hover:from-primary/90 hover:to-primary/70",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200 hover-lift"
              )}
            >
              Submit Answer
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className={cn(
                "h-11 font-semibold",
                "border-primary/30 hover:border-primary/50",
                "hover:bg-primary/10",
                "transition-all duration-200"
              )}
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