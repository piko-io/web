import api from "@/shared/api/client";

export async function saveBoardQuizzes({
  boardId,
  accessToken,
  quizzes,
}: {
  boardId: string;
  accessToken: string;
  quizzes: {
    question: string;
    description: string;
    answers: string[];
    file: File;
  }[];
}) {
  await Promise.all(
    quizzes.map(async (q, idx) => {
      const formData = new FormData();

      formData.append("question", q.question);
      formData.append("description", q.description);
      q.answers.forEach((ans) => formData.append("answers", ans));
      formData.append("file", q.file);

      try {
        const res = await api.post(`/quiz/board/${boardId}`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(`퀴즈 ${idx} 저장 성공`, res.data);
      } catch (err) {
        console.error(`퀴즈 ${idx} 저장 실패`, err.response?.status, err.response?.data);
      }
    })
  );
}
