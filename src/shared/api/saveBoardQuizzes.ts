import api from "@/shared/api/client";

export async function saveBoardQuizzes({
  boardId,
  quizzes,
}: {
  boardId: string;
  quizzes: {
    question: string;
    description: string;
    answers: string[];
    file?: File;
  }[];
}) {
  const results = await Promise.allSettled(
    quizzes.map(async (quiz, index) => {
      try {
        const formData = new FormData();
        formData.append('question', quiz.question);
        formData.append('description', quiz.description);
        
        quiz.answers.forEach((answer) => {
          formData.append('answers', answer);
        });
        
        if (quiz.file) {
          formData.append('file', quiz.file);
        } else {
          formData.append('file', new Blob([]), '');
        }
        
        console.log('=== FormData 전송 내용 ===');
        for (let [key, value] of formData.entries()) {
          if (value instanceof File || value instanceof Blob) {
            console.log(`${key}: [File/Blob] ${value.name || 'blob'}`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
        
        const response = await api.post(`/quiz/board/${boardId}`, formData);
        console.log('POST 응답:', response.data);
        return response.data;
      } catch (error) {
        console.error(`퀴즈 ${index + 1} 저장 실패:`, error);
        throw error;
      }
    })
  );

  return results;
}