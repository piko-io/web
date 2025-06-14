"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useState, useRef } from "react";

export default function CreateQuizPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId;

  const [search, setSearch] = useState("");
  const [quizzes, setQuizzes] = useState<{ id: number; file: File; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddQuiz = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setQuizzes((prev) => [...prev, { id: Date.now(), file, preview }]);
    }
  };

  const handleRemoveQuiz = (id: number) => {
    setQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
  };

  const handleSave = () => {
    alert(`저장 완료 (보드 ID: ${boardId})`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">보드 ID: {boardId}</div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </div>

      <Input
        placeholder="검색어를 입력하세요."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-2xl"
      />

      <div className="mt-10 flex gap-6 flex-wrap">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="relative w-60 h-60 rounded-lg overflow-hidden shadow border">
            <img
              src={quiz.preview}
              alt="문제 썸네일"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button size="icon" variant="outline">
                ✏️
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleRemoveQuiz(quiz.id)}
              >
                🗑️
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
    </main>
  );
}
