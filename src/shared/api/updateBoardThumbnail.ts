import api from "@/shared/api/client";

export async function updateBoardThumbnail(boardId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.patch(`/board/${boardId}/thumbnail`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('보드 썸네일 업데이트 실패:', error);
    throw error;
  }
}