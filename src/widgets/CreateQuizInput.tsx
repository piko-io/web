"use client";

import { useState, useRef } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface CreateQuizInputProps {
  onCreate: (file: File, question: string, description: string) => void;
}

export default function CreateQuizInput({ onCreate }: CreateQuizInputProps) {
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile || !question.trim()) {
      alert("이미지와 문제 내용을 모두 입력하세요.");
      return;
    }
    onCreate(selectedFile, question, description);
    setSelectedFile(null);
    setQuestion("");
    setDescription("");
  };

  return (
    <div className="border rounded p-4 flex flex-col gap-4">
      <Input
        placeholder="문제 내용"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Input
        placeholder="문제 설명 (선택)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button variant="outline" onClick={handlePickFile}>
        이미지 선택
      </Button>
      {selectedFile && <span>{selectedFile.name}</span>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button onClick={handleSubmit}>퀴즈 생성</Button>
    </div>
  );
}
