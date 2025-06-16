import api from "@/shared/api/client";

export async function createQuiz(boardId: string, file: File, {
  question,
  description,
  answers,
}: {
  question: string;
  description: string;
  answers: string[];
}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("body", JSON.stringify({
    question,
    description,
    answers,
  }));

  const res = await api.post(`/quiz/board/${boardId}`, formData);
  return res.data.data;
}
