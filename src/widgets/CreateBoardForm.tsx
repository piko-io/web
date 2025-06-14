"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export default function CreateBoardForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic] = useState(true);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const boardId = Date.now();
    console.log({
      title,
      description,
      isPublic,
      thumbnail,
      boardId,
    });

    alert(`보드 생성 완료! (임시 ID: ${boardId})`);
    router.push(`/create-board/${boardId}/create-quiz`);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleThumbnailClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full p-6 bg-white rounded shadow flex flex-col gap-6"
      >
        <h1 className="text-2xl font-bold">보드 만들기</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="font-medium text-black">
            제목
          </label>
          <Input
            id="title"
            placeholder="제목 입력"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="font-medium text-black">
            설명
          </label>
          <textarea
            id="description"
            placeholder="설명 입력"
            className="border border-gray-300 rounded w-full p-3 focus:outline-none"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-medium text-black">썸네일</label>
          <div
            onClick={handleThumbnailClick}
            className="border-2 border-dashed border-black rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100"
          >
            {preview ? (
              <img
                src={preview}
                alt="썸네일 미리보기"
                className="mx-auto max-h-48 rounded"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-black">
                <span className="text-4xl">+</span>
                <span className="text-sm">
                  썸네일을 추가해보세요.
                </span>
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

        <Button type="submit">보드 생성 후 퀴즈 만들기</Button>
      </form>
    </main>
  );
}
