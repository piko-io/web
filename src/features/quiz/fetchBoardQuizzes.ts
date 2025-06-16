import api from "@/shared/api/client";

export async function fetchBoardQuizzes(boardId: string) {
  const { data } = await api.get(`/quiz/board/${boardId}`);
  return data.data;
}
