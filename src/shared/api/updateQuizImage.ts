import api from "@/shared/api/client";

export async function updateQuizImage(quizId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.patch(`/quiz/${quizId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('퀴즈 이미지 업데이트 실패:', error);
    throw error;
  }
}