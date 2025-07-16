"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBoard } from "@/features/board/createBoard";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function CreateBoardForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    
    if (!file) {
      alert("썸네일을 추가해주세요.");
      return;
    }

    try {
      console.log('보드 생성 데이터:', {
        title: title.trim(),
        description: description.trim(),
        difficulty: difficulty
      });
      
      const board = await createBoard({
        title: title.trim(),
        description: description.trim() || "설명이 없습니다.",
        difficulty: difficulty,
        file,
      });
      
      console.log('생성된 보드:', board);
      router.push(`/create-board/${board.id}/create-quiz`);
    } catch (error) {
      console.error('보드 생성 실패:', error);
      alert('보드 생성에 실패했습니다.');
    }
  };

  return (
    <main className="h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-6 bg-card rounded-xl shadow flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold">보드 만들기</h1>
        
        <div className="flex flex-col gap-1">
          <label className="font-medium">제목 *</label>
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
            className="border border-input rounded w-full p-3 focus:outline-none focus:ring-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium">난이도 *</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border border-input rounded w-full p-3 focus:outline-none focus:ring-2"
          >
            <option value="EASY">쉬움</option>
            <option value="NORMAL">보통</option>
            <option value="HARD">어려움</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="font-medium">썸네일 *</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/20"
          >
            {preview ? (
              <img
                src={preview}
                alt="썸네일"
                className="mx-auto max-h-48 rounded"
              />
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
          생성 후 퀴즈 만들기
        </Button>
      </form>
    </main>
  );
}