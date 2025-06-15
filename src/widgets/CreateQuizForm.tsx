"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { AnswerForm } from "@/features/quiz/AnswerForm/AnswerForm";
import { Pencil, Trash, Settings, Search } from "lucide-react";

export default function CreateQuizForm() {
  const router = useRouter();
  const params = useParams();
  const [boardId, setBoardId] = useState<string | null>(null);

  const [quizzes, setQuizzes] = useState<
    { id: number; preview?: string; answers: string[] }[]
  >([]);

  const [search, setSearch] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [tempAnswers, setTempAnswers] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (params.boardId) {
      setBoardId(params.boardId as string);
    }
  }, [params.boardId]);

  useEffect(() => {
    if (!boardId) return;
    const raw = localStorage.getItem("myBoards") || "[]";
    const boards = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    const current = boards.find((b: any) => b.id == boardId);
    if (current && Array.isArray(current.quizzes)) {
      setQuizzes(current.quizzes);
    }
  }, [boardId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const newQuiz = { id: Date.now(), preview: base64, answers: [] };

      setQuizzes((prev) => {
        const updated = [...prev, newQuiz];

        if (boardId) {
          const raw = localStorage.getItem("myBoards") || "[]";
          const boards = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
          const updatedBoards = boards.map((b: any) =>
            b.id == boardId ? { ...b, quizzes: updated } : b
          );
          localStorage.setItem("myBoards", JSON.stringify(updatedBoards));
        }

        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddQuiz = () => fileInputRef.current?.click();

  const handleRemoveQuiz = (id: number) => {
    setQuizzes((prev) => {
      const updated = prev.filter((quiz) => quiz.id !== id);

      if (boardId) {
        const raw = localStorage.getItem("myBoards") || "[]";
        const boards = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
        const updatedBoards = boards.map((b: any) =>
          b.id == boardId ? { ...b, quizzes: updated } : b
        );
        localStorage.setItem("myBoards", JSON.stringify(updatedBoards));
      }

      return updated;
    });
  };

  const openAnswerDialog = (quizId: number, answers: string[]) => {
    setSelectedQuizId(quizId);
    setTempAnswers(answers);
  };

  const handleSaveAnswer = () => {
    if (selectedQuizId != null) {
      setQuizzes((prev) => {
        const updated = prev.map((quiz) =>
          quiz.id === selectedQuizId ? { ...quiz, answers: tempAnswers } : quiz
        );

        if (boardId) {
          const raw = localStorage.getItem("myBoards") || "[]";
          const boards = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
          const updatedBoards = boards.map((b: any) =>
            b.id == boardId ? { ...b, quizzes: updated } : b
          );
          localStorage.setItem("myBoards", JSON.stringify(updatedBoards));
        }

        return updated;
      });
      setSelectedQuizId(null);
      setTempAnswers([]);
    }
  };

  const handleSave = () => {
    if (!boardId) return;
    const raw = localStorage.getItem("myBoards") || "[]";
    const boards = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    const updated = boards.map((b: any) =>
      b.id == boardId ? { ...b, quizzes } : b
    );
    localStorage.setItem("myBoards", JSON.stringify(updated));
    alert(`퀴즈 저장 완료!`);
    router.push(`/my-boards`);
  };

  const handleCancel = () => router.back();

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.answers.some((answer) =>
        answer.toLowerCase().includes(search.toLowerCase())
      ) || search.trim() === ""
  );

  return (
    <main className="min-h-screen flex flex-col items-start p-8 gap-6">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => boardId && router.push(`/create-board/${boardId}`)}
          >
            <Settings className="w-4 h-4 mr-1" />
            보드 수정
          </Button>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCancel}>
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
            className={`relative w-60 h-60 rounded-lg overflow-hidden shadow border ${
              quiz.answers.length === 0 ? "border-red-500" : ""
            } cursor-pointer`}
            onClick={() => {
              if (quiz.answers.length === 0)
                openAnswerDialog(quiz.id, quiz.answers);
            }}
          >
            {quiz.preview ? (
              <img
                src={quiz.preview}
                alt="퀴즈 썸네일"
                className={`w-full h-full object-cover ${
                  quiz.answers.length === 0 ? "opacity-50" : ""
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                썸네일 없음
              </div>
            )}

            {quiz.answers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center text-3xl animate-pop">
                  !
                </div>
              </div>
            )}

            <div className="absolute bottom-2 right-2 flex gap-2">
              {quiz.answers.length > 0 && (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAnswerDialog(quiz.id, quiz.answers);
                  }}
                >
                  <Pencil className="w-5 h-5" />
                </Button>
              )}
              <Button
                size="icon"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveQuiz(quiz.id);
                }}
              >
                <Trash className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}

        <div
          onClick={handleAddQuiz}
          className="border-2 border-dashed border-black rounded-lg p-12 text-center cursor-pointer hover:bg-gray-100 w-60 h-60 flex flex-col items-center justify-center"
        >
          <span className="text-4xl">+</span>
          <span className="mt-2 text-base">문제를 추가해보세요.</span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <Dialog
        open={selectedQuizId != null}
        onOpenChange={() => setSelectedQuizId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정답 입력</DialogTitle>
          </DialogHeader>
          <AnswerForm
            answers={tempAnswers}
            onAdd={(a) => setTempAnswers((prev) => [...prev, a])}
            onRemove={(a) =>
              setTempAnswers((prev) => prev.filter((x) => x !== a))
            }
            onSave={handleSaveAnswer}
            onCancel={() => setSelectedQuizId(null)}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
