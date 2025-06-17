"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";

export default function QuizPreviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [board, setBoard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoard() {
      try {
        setLoading(true);
        
        console.log('보드 ID:', id);
        
        const response = await fetch(`https://piko.alpa.dev/board/details/${id}`, {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API 응답:', data);
        
        if (data.status === 200 && data.data) {
          setBoard(data.data);
        } else {
          throw new Error('응답 데이터가 올바르지 않습니다');
        }
        
      } catch (err) {
        console.error('데이터 로딩 실패:', err);
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

  const handleStartQuiz = () => {
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

  if (!board) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center gap-8 p-8 bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>보드를 찾을 수 없습니다</CardTitle>
            <CardDescription>요청하신 보드가 존재하지 않습니다.</CardDescription>
          </CardHeader>
        </Card>
        <Button variant="outline" onClick={() => router.back()}>
          뒤로 가기
        </Button>
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
      <Button size="lg" onClick={handleStartQuiz}>
        퀴즈 풀러가기
      </Button>
    </main>
  );
}