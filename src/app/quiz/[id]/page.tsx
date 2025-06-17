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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoard() {
      try {
        setLoading(true);
        const boardData = await fetchQuizDetails(id as string);
        setBoard(boardData);
      } catch (err) {
        console.error(err);
        setBoard(null);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center gap-8 p-8 bg-background">
        <div className="w-[400px] h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">로딩 중...</span>
        </div>
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse mt-2"></div>
          </CardHeader>
        </Card>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </main>
    );
  }

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