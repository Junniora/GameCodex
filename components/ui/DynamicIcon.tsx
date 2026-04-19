import { lazy, Suspense } from 'react';
import {
  Gamepad2,
  Folder,
  BookOpen,
  Settings,
  Star,
  Home,
  Sun,
  Moon,
  User,
  LogOut,
  Target,
  Swords,
  Map,
  Trophy,
  Hammer,
  Pickaxe,
  Bed,
  Lightbulb,
  Globe,
  Sparkles,
  Search,
  LucideProps,
  HelpCircle
} from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

// Map common emojis from seed to Lucide Icons
const EMOJI_TO_ICON: Record<string, any> = {
  '🏗️': Hammer,
  '🎯': Target,
  '⚔️': Swords,
  '♟️': Trophy, // Using Trophy as placeholder for strategy/chess
  '🗺️': Map,
  '⚽': Trophy,
  '🎮': Gamepad2,
  '🗂️': Folder,
  '📚': BookOpen,
  '🪵': Hammer,
  '🏠': Home,
  '🍖': Target, // Fallback
  '💡': Lightbulb,
  '⛏️': Pickaxe,
  '🛏️': Bed,
  '🇲🇽': Globe,
  '🇺🇸': Globe,
  '⭐': Star,
  '⚙️': Settings,
  '✨': Sparkles,
  '🔍': Search,
};

export default function DynamicIcon({ name, ...props }: DynamicIconProps) {
  // If the name is one of the mapped emojis, return the corresponding Lucide icon
  if (EMOJI_TO_ICON[name]) {
    const IconComponent = EMOJI_TO_ICON[name];
    return <IconComponent {...props} />;
  }

  // If it's a generic emoji (not mapped) or string that doesn't match an icon, just render it as text
  // However, we want to try rendering a Lucide icon first if it matches a string name (for future DB entries)
  // Since dynamic import for ALL icons in lucide-react is too large, we could use dynamic imports or just fallback to HelpCircle
  // For this implementation, we assume if it's not an emoji, we fallback to HelpCircle or just render the text
  
  // Checking if the name is an emoji (simple regex)
  const isEmoji = /[\p{Extended_Pictographic}]/u.test(name);
  if (isEmoji) {
    return <span className={props.className} style={{ width: props.size, height: props.size, display: 'inline-block', lineHeight: 1 }}>{name}</span>;
  }

  // Default fallback if we need an icon but couldn't map it
  return <HelpCircle {...props} />;
}
