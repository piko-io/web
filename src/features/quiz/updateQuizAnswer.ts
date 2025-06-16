import api from "@/shared/api/client";

export async function updateQuizAnswer(quizId: string, answers: string[]) {
  await api.patch(`/quiz/${quizId}`, { answers });
}
