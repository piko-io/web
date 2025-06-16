"use client";

import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Upload } from "lucide-react";
import { AnswerForm } from "@/features/quiz/AnswerForm/AnswerForm";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

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
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialData?.preview);
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
              <img src={previewUrl} alt="미리보기" className="w-full object-contain rounded-lg" />
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

          <div>
            <p className="mb-2 text-sm text-muted-foreground">정답 입력</p>
            <AnswerForm
              answers={answers}
              onAdd={(a) => setAnswers((prev) => [...prev, a])}
              onRemove={(a) => setAnswers((prev) => prev.filter((x) => x !== a))}
              onSave={handleCreate}
              onCancel={onClose}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
