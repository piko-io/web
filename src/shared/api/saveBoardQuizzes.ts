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
    quizzes.map(async (quiz) => {
      const formData = new FormData();
      formData.append('question', quiz.question);
      formData.append('description', quiz.description);
      
      quiz.answers.forEach((answer) => {
        formData.append('answers', answer);
      });
      
      if (quiz.file) {
        formData.append('file', quiz.file);
      }
      
      const response = await api.post(`/quiz/board/${boardId}`, formData);
      return response.data;
    })
  );
  
  return results;
}