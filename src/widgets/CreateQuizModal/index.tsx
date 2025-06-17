"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Upload } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CreateQuizModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (args: {
    file?: File;
    question: string;
    description: string;
    answers: string[];
  }) => void;
  initialData?: {
    preview?: string;
    question: string;
    description: string;
    answers: string[];
  };
}

export default function CreateQuizModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: CreateQuizModalProps) {
  const [question, setQuestion] = useState(initialData?.question || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [answers, setAnswers] = useState<string[]>(initialData?.answers || []);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    initialData?.preview
  );
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question || "");
      setDescription(initialData.description || "");
      setAnswers(initialData.answers || []);
      setPreviewUrl(initialData.preview);
      setFile(null);
    } else {
      setQuestion("");
      setDescription("");
      setAnswers([]);
      setPreviewUrl(undefined);
      setFile(null);
    }
  }, [initialData, open]);

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleAddAnswer = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !answers.includes(trimmed) && answers.length < 10) {
      setAnswers((prev) => [...prev, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAnswer();
    }
  };

  const handleRemoveAnswer = (answer: string) => {
    setAnswers((prev) => prev.filter((a) => a !== answer));
  };

  const handleCreate = () => {
    if (!question.trim()) {
      alert("문제 제목을 입력하세요.");
      return;
    }

    onSubmit({
      file: file ?? undefined,
      question,
      description,
      answers,
    });

    setQuestion("");
    setDescription("");
    setAnswers([]);
    setFile(null);
    setPreviewUrl(undefined);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl flex flex-col max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>문제 {initialData ? "수정" : "추가"}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-grow">
          <label
            className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/30 max-h-[300px] overflow-hidden"
            onClick={handleFileSelect}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="미리보기"
                className="w-full object-contain rounded-lg"
              />
            ) : (
              <>
                <Upload className="w-8 h-8 mb-2" />
                <span>이미지 선택</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <Input
            placeholder="문제 제목"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <div>
            <p className="mb-2 text-sm text-muted-foreground">코드 문제</p>
            <div className="h-[200px] w-full border rounded overflow-hidden">
              <MonacoEditor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={description}
                onChange={(v) => setDescription(v || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="mb-2 text-sm text-muted-foreground">정답 입력</p>
            <div className="flex gap-2">
              <Input
                placeholder="정답을 입력하세요 (최대 100자, 최대 10개)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button type="button" onClick={handleAddAnswer}>
                추가
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {answers.map((answer) => (
                <Badge
                  key={answer}
                  variant="outline"
                  className="flex items-center gap-1 text-base px-2 py-0.5"
                >
                  {answer}
                  <button
                    type="button"
                    onClick={() => handleRemoveAnswer(answer)}
                    className="ml-1"
                  >
                    &times;
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleCreate}>확인</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
