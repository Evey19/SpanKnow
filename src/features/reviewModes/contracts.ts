export type ReviewMode = "recall" | "discern" | "rapid" | "feynman";

export type ReviewDeckSelection =
  | { type: "all" }
  | { type: "wrong" }
  | { type: "custom"; ids: string[] };

export interface ReviewSession {
  session_id: string;
  mode: ReviewMode;
  deck: ReviewDeckSelection;
  total?: number;
}

export type ReviewQuestion = RecallReviewQuestion | DiscernReviewQuestion | RapidReviewQuestion | FeynmanReviewQuestion;

export interface FeynmanReviewQuestion {
  id: string;
  type: "feynman";
  prompt: string;
  explanation?: string;
  keywords?: string[];
}

export interface RecallReviewQuestion {
  id: string;
  type: "recall";
  prompt: string;
  answer: string;
  explanation?: string;
}

export type DiscernQuestionKind = "single" | "multi" | "boolean";

export interface DiscernReviewQuestion {
  id: string;
  type: "discern";
  group_title: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    example?: string;
  }>;
  question: {
    kind: DiscernQuestionKind;
    prompt: string;
    options: Array<{
      id: string;
      text: string;
    }>;
    correct_option_ids: string[];
  };
  analysis?: {
    compare_table?: Array<{
      label: string;
      values: Record<string, string>;
    }>;
    key_differences?: string[];
    summary?: string;
  };
}

export interface RapidReviewQuestion {
  id: string;
  type: "rapid";
  prompt: string;
  explanation?: string;
  mnemonic?: string;
}

export type ReviewAnswer = RecallReviewAnswer | DiscernReviewAnswer | RapidReviewAnswer | FeynmanReviewAnswer;

export interface FeynmanReviewAnswer {
  type: "feynman";
  user_answer: string;
}

export type RecallDecision = "mastered" | "blurry" | "forgot";

export interface RecallReviewAnswer {
  type: "recall";
  revealed_answer: boolean;
  decision: RecallDecision;
}

export interface DiscernReviewAnswer {
  type: "discern";
  selected_option_ids: string[];
}

export type RapidResult = "know" | "dont_know" | "timeout";

export interface RapidReviewAnswer {
  type: "rapid";
  result: RapidResult;
}

export interface SubmitReviewAnswerRequest {
  question_id: string; // The ID of the card being reviewed
  answer: ReviewAnswer;
  elapsed_ms: number;
  events?: {
    swiped?: boolean;
    paused_ms?: number;
  };
}

export interface SubmitReviewAnswerResponse {
  accepted: true;
  correct?: boolean;
  next_questions?: ReviewQuestion[];
  feedback?: string;
  rating_assigned?: number;
  new_state?: number;
  scheduled_days?: number;
  next_due?: string;
}

export interface ReviewSummary {
  total_answered: number;
  accuracy?: number;
  mastery_rate: number;
  breakdown: Record<string, number>;
  duration_ms: number;
  weak_points?: string[];
}

