import api from "@/shared/api/client";

export async function fetchAllBoards() {
  try {
    const response = await api.get('/board');
    return response.data.data || response.data;
  } catch (error) {
    console.error('전체 보드 목록 조회 실패:', error);
    throw error;
  }
}