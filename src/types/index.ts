import type { LucideIcon } from 'lucide-react';

export interface Plant {
  id: string;
  commonName: string;
  latinName: string;
  description: string;
  therapeuticUses: string[];
  region: string;
  classification: string;
  imageSrc: string;
  imageHint?: string;
  videoSrc?: string; // URL to video
  audioSrc?: string; // URL to audio narration
  threeDModelSrc?: string; // Placeholder for سى D model path or identifier
  ayushUses?: string;
}

export interface TourCategory {
  id:string;
  name: string;
  description: string;
  icon?: LucideIcon;
  plantIds: string[]; // IDs of plants in this tour
  imageSrc: string;
  imageHint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  plantId?: string; // Optional: link question to a specific plant
}

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  achieved: boolean;
}

export interface QuizResult {
    score: number;
    total: number;
    date: string;
}

export interface UserProgress {
    viewedPlants?: Record<string, string>;
    quizHistory?: QuizResult[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface TreflePlant {
  id: number;
  common_name: string;
  scientific_name: string;
  year: number;
  bibliography: string;
  author: string;
  status: string;
  rank: string;
  family_common_name: string;
  genus_id: number;
  image_url: string;
  synonyms: string[];
  genus: string;
  family: string;
  links: {
    self: string;
    plant: string;
    genus: string;
  };
}

export interface TrefleSearchResponse {
    data: TreflePlant[];
    links: {
        self: string;
        first: string;
        last: string;
    },
    meta: {
        total: number;
    }
}
