import { Card, Player } from '@/types/game';

export const CARD_COLORS = ['red', 'yellow', 'green', 'blue'] as const;
export const CARD_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', 'Draw Two'] as const;
export const WILD_VALUES = ['Wild', 'Wild Draw Four'] as const;

export function createDeck(): Card[] {
  const deck: Card[] = [];
  
  // Add numbered cards (0-9) and action cards
  CARD_COLORS.forEach(color => {
    // One 0 card per color
    deck.push({ color, value: '0', id: `${color}-0` });
    
    // Two of each other card per color
    for (let i = 1; i <= 9; i++) {
      deck.push({ color, value: i.toString(), id: `${color}-${i}-1` });
      deck.push({ color, value: i.toString(), id: `${color}-${i}-2` });
    }
    
    // Action cards
    ['Skip', 'Reverse', 'Draw Two'].forEach(value => {
      deck.push({ color, value, id: `${color}-${value}-1` });
      deck.push({ color, value, id: `${color}-${value}-2` });
    });
  });
  
  // Add wild cards
  for (let i = 0; i < 4; i++) {
    deck.push({ color: 'wild', value: 'Wild', id: `wild-${i}` });
    deck.push({ color: 'wild', value: 'Wild Draw Four', id: `wild-draw-${i}` });
  }
  
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function canPlayCard(card: Card, topCard: Card, activeColor?: string): boolean {
  // Wild cards can always be played
  if (card.color === 'wild') return true;
  
  // Check color match (including active color from wild cards)
  if (activeColor && card.color === activeColor) return true;
  if (card.color === topCard.color) return true;
  
  // Check value match
  if (card.value === topCard.value) return true;
  
  return false;
}

export function getCardScore(card: Card): number {
  if (card.value === 'Wild' || card.value === 'Wild Draw Four') return 50;
  if (['Skip', 'Reverse', 'Draw Two'].includes(card.value)) return 20;
  return parseInt(card.value) || 0;
}

export function calculateHandScore(cards: Card[]): number {
  return cards.reduce((total, card) => total + getCardScore(card), 0);
}

export function getNextPlayer(
  currentIndex: number,
  totalPlayers: number,
  direction: 1 | -1,
  skip: boolean = false
): number {
  let nextIndex = currentIndex + direction;
  if (skip) {
    nextIndex += direction;
  }
  
  // Handle wrap-around
  if (nextIndex >= totalPlayers) {
    nextIndex = nextIndex % totalPlayers;
  } else if (nextIndex < 0) {
    nextIndex = totalPlayers + (nextIndex % totalPlayers);
  }
  
  return nextIndex;
}

export function generateRoomPin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateBotName(): string {
  const adjectives = ['Swift', 'Clever', 'Bold', 'Sneaky', 'Lucky', 'Quick'];
  const nouns = ['Coder', 'Hacker', 'Dev', 'Ninja', 'Wizard', 'Master'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
}