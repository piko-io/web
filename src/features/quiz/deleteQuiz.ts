import api from "@/shared/api/client";

export async function deleteQuiz(quizId: string) {
  await api.delete(`/quiz/${quizId}`);
}
