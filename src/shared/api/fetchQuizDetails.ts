import api from "@/shared/api/client";

export async function fetchQuizDetails(quizId: string) {
  try {
    const response = await api.get(`/quiz/details/${quizId}`);
    return response.data.data;
  } catch (error) {
    console.error('퀴즈 상세 조회 실패:', error);
    throw error;
  }
}