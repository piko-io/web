import api from "@/shared/api/client";

export async function updateQuiz(quizId: string, data: {
  question: string;
  description: string;
  answers: string[];
}) {
  try {
    const response = await api.patch(`/quiz/${quizId}`, {
      question: data.question,
      description: data.description,
      answers: data.answers
    });
    
    return response.data;
  } catch (error) {
    console.error('퀴즈 업데이트 실패:', error);
    throw error;
  }
}