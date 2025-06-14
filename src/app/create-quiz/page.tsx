"use client";

import { useState } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";

export default function CreateQuizPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ 새 퀴즈 만들기
    const newQuiz = {
      id: Date.now(), // 임시 ID
      title,
      description,
      thumbnail,
    };

    // ✅ 기존 퀴즈 가져오기
    const existing = JSON.parse(localStorage.getItem("newQuizzes") || "[]");

    // ✅ 새로운 퀴즈 추가해서 다시 저장
    localStorage.setItem("newQuizzes", JSON.stringify([...existing, newQuiz]));

    alert("퀴즈 생성 완료!");
    router.push("/"); // 메인으로 이동
  };

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">퀴즈 만들기</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          placeholder="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          placeholder="썸네일 URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />
        <Button type="submit">퀴즈 만들기</Button>
      </form>
    </main>
  );
}
