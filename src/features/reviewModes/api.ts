import { fetchApi } from "@/api/client";
import type {
  ReviewDeckSelection,
  ReviewMode,
  ReviewQuestion,
  ReviewAnswer,
  ReviewSummary,
  SubmitReviewAnswerRequest,
  SubmitReviewAnswerResponse,
} from "./contracts";

function mapMode(mode: ReviewMode): string {
  if (mode === "recall") return "active_recall";
  if (mode === "discern") return "anti_fuzzy";
  if (mode === "rapid") return "quick_review";
  if (mode === "feynman") return "feynman";
  return "active_recall";
}

export async function createReviewSession(input: {
  mode: ReviewMode;
  deck: ReviewDeckSelection;
  prefetch: number;
}): Promise<{ session_id: string; questions: ReviewQuestion[]; total?: number }> {
  const limit = input.prefetch || 10;
  const mappedMode = mapMode(input.mode);
  
  const response = await fetchApi<{ data: { items: any[]; total_in_batch: number; mode: string } }>(
    "v1/review/cards/generate",
    {
      method: "GET",
      query: {
        mode: mappedMode,
        page: 1,
        limit,
      },
    }
  );
  
  const questions = mapGeneratedItemsToReviewQuestions(response.data.items, mappedMode);
  
  return {
    session_id: `session_${Date.now()}`,
    questions,
  };
}

export async function fetchNextReviewQuestions(input: {
  session_id: string;
  count: number;
  mode?: ReviewMode;
  page?: number;
}): Promise<{ questions: ReviewQuestion[] }> {
  if (input.mode && input.page) {
    const mappedMode = mapMode(input.mode);
    const response = await fetchApi<{ data: { items: any[]; total_in_batch: number; mode: string } }>(
      "v1/review/cards/generate",
      {
        method: "GET",
        query: {
          mode: mappedMode,
          page: input.page,
          limit: input.count,
        },
      }
    );
    return { questions: mapGeneratedItemsToReviewQuestions(response.data.items, mappedMode) };
  }
  
  return { questions: [] };
}

function mapGeneratedItemsToReviewQuestions(items: any[], mode: string): ReviewQuestion[] {
  return items.map((item) => {
    if (mode === "active_recall") {
      return {
        id: item.user_card_id,
        type: "recall",
        prompt: item.question || "请回忆该知识点的内容",
        answer: item.answer || item.content || "",
        explanation: item.content_title || undefined,
      };
    }
    if (mode === "quick_review") {
      return {
        id: item.user_card_id,
        type: "rapid",
        prompt: item.question || item.content || item.answer || "",
        explanation: item.content_title || undefined,
        mnemonic: item.mnemonic || undefined,
      };
    }
    if (mode === "anti_fuzzy") {
      const options = item.options || [];
      const correctOption = options.find((o: any) => o.value === item.correct_option);
      
      return {
        id: item.user_card_id,
        type: "discern",
        group_title: item.content_title || "辨析题",
        items: [], // anti_fuzzy direct mapping doesn't use these typically, but keeping for compatibility
        question: {
          kind: "single",
          prompt: item.question || "请选择正确的选项",
          options: options.map((o: any) => ({
            id: o.label,
            text: o.value,
          })),
          correct_option_ids: correctOption ? [correctOption.label] : [],
        },
        analysis: {
          summary: item.answer_explanation || "",
        },
      };
    }
    if (mode === "feynman") {
      return {
        id: item.user_card_id,
        type: "feynman",
        prompt: item.question || "",
        explanation: item.content_title || undefined,
        keywords: item.keywords || [],
      };
    }
    // Fallback
    return {
      id: item.user_card_id,
      type: "recall",
      prompt: item.question || "",
      answer: item.answer || item.content || "",
    };
  });
}

function getRatingFromAnswer(answer: ReviewAnswer, correct?: boolean): number {
  if (answer.type === "recall") {
    if (answer.decision === "mastered") return 4;
    if (answer.decision === "blurry") return 2;
    if (answer.decision === "forgot") return 1;
  }
  if (answer.type === "rapid") {
    if (answer.result === "know") return 4;
    if (answer.result === "timeout") return 2;
    if (answer.result === "dont_know") return 1;
  }
  if (answer.type === "discern") {
    return correct ? 4 : 1;
  }
  return 3;
}

export async function submitReviewAnswer(input: {
  session_id: string;
  request: SubmitReviewAnswerRequest;
}): Promise<SubmitReviewAnswerResponse> {
  const isFeynman = input.request.answer.type === "feynman";
  const rating = isFeynman ? undefined : getRatingFromAnswer(input.request.answer);
  const time_spent = Math.max(0, Math.round(input.request.elapsed_ms / 1000));
  
  const body: any = {
    user_card_id: input.request.question_id,
    time_spent
  };

  if (rating !== undefined) {
    body.rating = rating;
  }

  if (isFeynman) {
    body.user_answer = (input.request.answer as any).user_answer;
  }
  
  const response = await fetchApi<{ data: SubmitReviewAnswerResponse }>(
    `v1/review/submit`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
  
  return response.data || { accepted: true };
}

export async function fetchReviewSummary(input: { session_id: string }): Promise<ReviewSummary> {
  const response = await fetchApi<{ data: ReviewSummary }>(`v1/review/sessions/${input.session_id}/summary`, {
    method: "GET",
  });
  return response.data;
}
