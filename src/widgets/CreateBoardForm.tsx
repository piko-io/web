"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function CreateBoardForm() {
  const [boardId, setBoardId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isPublic] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  const router = useRouter();
  const params = useParams();
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
    if (current) {
      setTitle(current.title);
      setDescription(current.description);
      setPreview(current.thumbnail);
      setQuizzes(current.quizzes || []);
    }
  }, [boardId]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = boardId || Date.now();
    const newBoard = {
      id,
      title,
      description,
      isPublic,
      thumbnail: preview || "",
      quizzes,
    };

    const raw = localStorage.getItem("myBoards") || "[]";
    const boards = Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
    const updated = boards.filter((b: any) => b.id != id);
    localStorage.setItem("myBoards", JSON.stringify([...updated, newBoard]));

    alert(`보드 저장 완료!`);
    router.push(`/create-board/${id}/create-quiz`);
  };

  return (
    <main className="h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-6 bg-card rounded-xl shadow flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold">
          보드 {boardId ? "수정" : "만들기"}
        </h1>

        <div className="flex flex-col gap-1">
          <label className="font-medium">제목</label>
          <Input
            placeholder="제목 입력"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium">설명</label>
          <textarea
            placeholder="설명 입력"
            className="
              border border-input rounded w-full p-3
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            "
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium">썸네일</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/20"
          >
            {preview ? (
              <img src={preview} alt="썸네일" className="mx-auto max-h-48 rounded" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">+</span>
                <span className="text-sm">썸네일을 추가해보세요.</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="hidden"
          />
        </div>

        <Button type="submit" size="lg" className="w-full">
          보드 {boardId ? "수정 완료" : "생성 후 퀴즈 만들기"}
        </Button>
      </form>
    </main>
  );
}
