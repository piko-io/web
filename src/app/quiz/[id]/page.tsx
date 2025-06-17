"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { fetchQuizDetails } from "@/shared/api/fetchQuizDetails";

export default function QuizDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [board, setBoard] = useState<any>(null);

  useEffect(() => {
    async function loadBoard() {
      try {
        const boardData = await fetchQuizDetails(id as string);
        setBoard(boardData);
      } catch (err) {
        console.error(err);
        setBoard(null);
      }
    }

    if (id) {
      loadBoard();
    }
  }, [id]);

  const boardTitle = board?.title && board.title.trim().length > 0 
    ? board.title 
    : "제목이 없는 보드";
  const boardDescription = board?.description && board.description.trim().length > 0 
    ? board.description 
    : "설명이 등록되지 않았습니다.";
  const thumbnailSrc = board?.thumbnail?.path
    ? `https://s3.alpa.dev/piko/${board.thumbnail.path}`
    : "/thumbnails/poketmon.png";

  const handlePlay = () => {
    router.push(`/quiz/${id}/play`);
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-8 p-8 bg-background">
      <img
        src={thumbnailSrc}
        alt={boardTitle}
        width={400}
        height={400}
        className="rounded-lg object-cover"
      />
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>{boardTitle}</CardTitle>
          <CardDescription>{boardDescription}</CardDescription>
        </CardHeader>
      </Card>
      <Button size="lg" onClick={handlePlay}>
        퀴즈 풀러가기
      </Button>
    </main>
  );
}