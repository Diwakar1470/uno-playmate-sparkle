import React from 'react';
import { Card } from '@/types/game';
import { cn } from '@/lib/utils';

interface UnoCardProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  isPlayable?: boolean;
  faceDown?: boolean;
  className?: string;
}

const UnoCard: React.FC<UnoCardProps> = ({
  card,
  onClick,
  disabled = false,
  size = 'medium',
  isPlayable = true,
  faceDown = false,
  className,
}) => {
  const sizeClasses = {
    small: 'w-12 h-16 text-xs',
    medium: 'w-20 h-28 text-base',
    large: 'w-28 h-40 text-xl',
  };

  const colorClasses = {
    red: 'bg-red-500 border-red-600',
    yellow: 'bg-yellow-400 border-yellow-500',
    green: 'bg-green-500 border-green-600',
    blue: 'bg-blue-500 border-blue-600',
    wild: 'gradient-wild border-purple-600',
  };

  const getSymbol = (value: string) => {
    switch (value) {
      case 'Skip': return '⊘';
      case 'Reverse': return '⟲';
      case 'Draw Two': return '+2';
      case 'Wild': return '🎨';
      case 'Wild Draw Four': return '+4';
      default: return value;
    }
  };

  if (faceDown) {
    return (
      <div
        className={cn(
          'rounded-lg gradient-card-back border-2 border-gray-700 shadow-card cursor-pointer transition-all hover:shadow-glow hover:-translate-y-1',
          sizeClasses[size],
          'flex items-center justify-center',
          className
        )}
        onClick={onClick}
      >
        <span className="font-orbitron font-bold text-primary text-glow">CODE</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg border-2 shadow-card transition-all',
        colorClasses[card.color],
        sizeClasses[size],
        'flex flex-col items-center justify-center relative overflow-hidden',
        !disabled && isPlayable && 'cursor-pointer hover:shadow-glow hover:scale-105 hover:-translate-y-1',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative z-10 flex flex-col items-center">
        <span className="font-orbitron font-bold text-white drop-shadow-lg">
          {getSymbol(card.value)}
        </span>
        {card.color === 'wild' && (
          <div className="absolute inset-0 animate-pulse-glow"></div>
        )}
      </div>
      {size !== 'small' && (
        <div className="absolute top-1 left-1 text-white/80 text-xs font-bold">
          {getSymbol(card.value)}
        </div>
      )}
    </div>
  );
};

export default UnoCard;