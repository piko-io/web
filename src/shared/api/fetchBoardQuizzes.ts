import api from "@/shared/api/client";

export async function fetchBoardQuizzes(boardId: string) {
  try {
    console.log('퀴즈 불러오기 시작:', boardId);
    const response = await api.get(`/quiz/board/${boardId}`);
    console.log('퀴즈 불러오기 응답:', response.data);
    
    if (response.data && response.data.data) {
      return response.data.data;
    }
    
    return response.data;
  } catch (error) {
    console.error('보드 퀴즈 불러오기 실패:', error);
    throw error;
  }
}