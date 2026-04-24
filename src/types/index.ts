export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  summary?: string;
  source?: string;
  sourceUrl?: string;
  coverImage?: string;
  type: 'link' | 'text' | 'note';
  tags: string[];
  knowledgePoints?: string[];
  createdAt: Date;
  nextReviewDate?: Date;
  reviewCount: number;
  lastReviewedAt?: Date;
}

export interface ReviewSchedule {
  itemId: string;
  nextReviewDate: Date;
  interval: number;
}

export type ReviewFeedback = 'remembered' | 'needs_review';

export interface AppState {
  knowledgeItems: KnowledgeItem[];
  tags: string[];
  searchQuery: string;
}
