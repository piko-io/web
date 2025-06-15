"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Play } from "lucide-react";

interface AnswerFormProps {
  answers: string[];
  onAdd: (answer: string) => void;
  onRemove: (answer: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function AnswerForm({ answers, onAdd, onRemove, onSave, onCancel }: AnswerFormProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !answers.includes(trimmed) && answers.length < 10) {
      onAdd(trimmed);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="정답을 입력하세요 (최대 100자, 최대 10개)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button type="button" onClick={handleAdd}>
            <Play className="w-4 h-4" />
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
                onClick={() => onRemove(answer)}
                className="ml-1"
              >
                &times;
              </button>
            </Badge>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          ※ 음란물, 비하, 혐오 등의 퀴즈는 만들지 마세요 ^^
        </p>
      </div>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button onClick={onSave}>확인</Button>
      </div>
    </div>
  );
}
