"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Pencil, Trash, Search } from "lucide-react";
import CreateQuizModal from "@/widgets/CreateQuizModal";
import { saveBoardQuizzes } from "@/shared/api/saveBoardQuizzes";

interface Quiz {
  id: string;
  preview?: string;
  question: string;
  description: string;
  answers: string[];
  file?: File; 
}

export default function CreateQuizForm() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId as string;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [search, setSearch] = useState("");
  const [openNewQuiz, setOpenNewQuiz] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const handleCreateQuiz = (data: {
    file?: File;
    question: string;
    description: string;
    answers: string[];
  }) => {
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      preview: data.file ? URL.createObjectURL(data.file) : undefined,
      question: data.question,
      description: data.description,
      answers: data.answers,
      file: data.file,
    };
    setQuizzes((prev) => [...prev, newQuiz]);
  };

  const handleUpdateQuiz = (data: {
    file?: File;
    question: string;
    description: string;
    answers: string[];
  }) => {
    if (!editingQuiz) return;
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === editingQuiz.id
          ? {
              ...q,
              preview: data.file ? URL.createObjectURL(data.file) : q.preview,
              question: data.question,
              description: data.description,
              answers: data.answers,
              file: data.file,
            }
          : q
      )
    );
    setEditingQuiz(null);
  };

  const handleRemoveQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.question.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    await saveBoardQuizzes({ boardId, quizzes });
    router.push("/my-boards");
  };

  return (
    <main className="min-h-screen flex flex-col items-start p-8 gap-6">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full max-w-xl">
        <Input
          placeholder="검색어를 입력하세요."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
        />
        <Button size="icon">
          <Search className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex gap-6 flex-wrap justify-start items-start">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="relative w-60 h-60 rounded-lg overflow-hidden shadow border cursor-pointer flex flex-col justify-between"
          >
            {quiz.preview ? (
              <img
                src={quiz.preview}
                alt="썸네일"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center p-4 bg-gray-50">
                <p className="font-semibold text-black">
                  {quiz.question || "제목 없음"}
                </p>
              </div>
            )}

            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setEditingQuiz(quiz)}
              >
                <Pencil className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleRemoveQuiz(quiz.id)}
              >
                <Trash className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}

        <div
          onClick={() => setOpenNewQuiz(true)}
          className="border-2 border-dashed border-black rounded-lg p-12 text-center cursor-pointer hover:bg-gray-100 w-60 h-60 flex flex-col items-center justify-center"
        >
          <span className="text-4xl">+</span>
          <span className="mt-2 text-base">문제를 추가해보세요.</span>
        </div>
      </div>

      <CreateQuizModal
        open={openNewQuiz}
        onClose={() => setOpenNewQuiz(false)}
        onSubmit={handleCreateQuiz}
      />

      <CreateQuizModal
        open={!!editingQuiz}
        onClose={() => setEditingQuiz(null)}
        onSubmit={handleUpdateQuiz}
        initialData={editingQuiz ?? undefined}
      />
    </main>
  );
}
