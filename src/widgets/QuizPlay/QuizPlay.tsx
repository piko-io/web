"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Play } from "lucide-react";

export function QuizPlay() {
  const { id } = useParams();
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);

  const correctAnswer = "피카츄";
  const imageSrc = "/thumbnails/poketmon.png";

  const handleSubmit = () => {
    if (answer.trim() === correctAnswer) {
      setResult("correct");
    } else {
      setResult("wrong");
    }
  };

  const handleNext = () => {
    alert("다음 문제로 이동");
    setResult(null);
    setAnswer("");
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-8 p-8">
      <img
        src={imageSrc}
        alt="문제 이미지"
        className="w-[400px] max-w-full h-auto object-contain rounded-lg "
      />

      {result === "wrong" && (
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500">오답!</p>
          <p className="text-xl font-bold mt-2">{correctAnswer}</p>
        </div>
      )}

      {result === "correct" && (
        <p className="text-center text-green-500 text-2xl font-bold">정답!</p>
      )}

      {result ? (
        <Button onClick={handleNext} className="mt-4 flex items-center gap-2">
          다음
          <Play className="w-5 h-5" />
        </Button>
      ) : (
        <div className="flex w-full max-w-lg gap-2">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="정답 입력"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button onClick={handleSubmit}>
            <Play className="w-5 h-5" />
          </Button>
        </div>
      )}
    </main>
  );
}
