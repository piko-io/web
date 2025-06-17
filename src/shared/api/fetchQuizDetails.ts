import api from "@/shared/api/client";

export async function fetchQuizDetails(boardId: string) {
  try {
    const response = await api.get(`/board/details/${boardId}`);
    return response.data.data;
  } catch (error) {
    console.error('보드 상세 조회 실패:', error);
    throw error;
  }
}