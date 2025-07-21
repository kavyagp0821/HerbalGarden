// src/lib/icon-mapping.ts
import { ShieldHalf, Brain, Soup, Waves, LucideIcon, Sparkles, Sun } from 'lucide-react';

// This mapping allows us to store a string in the database 
// and dynamically render the corresponding Lucide icon component on the client.
export const lucideIconMapping: { [key: string]: LucideIcon } = {
  ShieldHalf,
  Brain,
  Soup,
  Waves,
  Sparkles,
  Sun,
};
