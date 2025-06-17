import api from "@/shared/api/client";

export async function checkAnswer(quizId: string, answer: string) {
  try {
    const response = await api.post(`/quiz/answer/${quizId}`, {
      answer: answer
    });
    
    return response.data;
  } catch (error) {
    console.error('정답 확인 실패:', error);
    throw error;
  }
}