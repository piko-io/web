import api from "@/shared/api/client";

export async function updateBoard(boardId: string, data: {
  title: string;
  description: string;
  difficulty?: string;
}) {
  try {
    const response = await api.patch(`/board/${boardId}`, {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty
    });
    
    return response.data;
  } catch (error) {
    console.error('보드 업데이트 실패:', error);
    throw error;
  }
}