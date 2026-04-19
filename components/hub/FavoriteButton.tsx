'use client';
// components/hub/FavoriteButton.tsx
import { Star } from 'lucide-react';
interface Props {
  isFavorite: boolean;
  onToggle: () => void;
}

export default function FavoriteButton({ isFavorite, onToggle }: Props) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
      className={`
        p-1.5 rounded-full backdrop-blur-sm transition-all duration-200
        active:scale-90
        ${isFavorite
          ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30'
          : 'bg-black/30 text-white/60 hover:text-yellow-400 hover:bg-yellow-400/10'
        }
      `}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
}
