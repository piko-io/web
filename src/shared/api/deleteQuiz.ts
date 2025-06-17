import api from "@/shared/api/client";

export async function deleteQuiz(quizId: string) {
  try {
    const response = await api.delete(`/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('퀴즈 삭제 실패:', error);
    throw error;
  }
}