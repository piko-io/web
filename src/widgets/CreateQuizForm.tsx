"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { useState, useRef } from "react";
import { AnswerForm } from "@/features/quiz/AnswerForm/AnswerForm";
import { Pencil, Trash } from "lucide-react"; 

export default function CreateQuizForm() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId;

  const [quizzes, setQuizzes] = useState<{
    id: number;
    file: File;
    preview: string;
    answers: string[];
  }[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [tempAnswers, setTempAnswers] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddQuiz = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setQuizzes((prev) => [
        ...prev,
        { id: Date.now(), file, preview, answers: [] },
      ]);
    }
  };

  const handleRemoveQuiz = (id: number) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
  };

  const openAnswerDialog = (quizId: number, answers: string[]) => {
    setSelectedQuizId(quizId);
    setTempAnswers(answers);
  };

  const handleSaveAnswer = () => {
    if (selectedQuizId != null) {
      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === selectedQuizId ? { ...quiz, answers: tempAnswers } : quiz
        )
      );
      setSelectedQuizId(null);
      setTempAnswers([]);
    }
  };

  const handleSave = () => {
    console.log("최종 저장:", quizzes);
    alert(`저장 완료 (보드 ID: ${boardId})`);
  };

  const handleCancel = () => router.back();

  return (
    <main className="min-h-screen flex flex-col gap-8 p-8">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">보드 ID: {boardId}</div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </div>

      <div className="mt-10 flex gap-6 flex-wrap">
        {quizzes.map((quiz) => (
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
            <img
              src={quiz.preview}
              alt="퀴즈 썸네일"
              className={`w-full h-full object-cover ${
                quiz.answers.length === 0 ? "opacity-50" : ""
              }`}
            />

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
                  <Pencil className="w-5 h-5" /> {/* Lucide 수정 아이콘 */}
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
                <Trash className="w-5 h-5" /> {/* Lucide 삭제 아이콘 */}
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
