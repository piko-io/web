import api from "@/shared/api/client";

export async function deleteBoard(boardId: string) {
  try {
    const response = await api.delete(`/board/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('보드 삭제 실패:', error);
    throw error;
  }
}