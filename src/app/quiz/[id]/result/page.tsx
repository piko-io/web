"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Trophy, RotateCcw, Home } from "lucide-react";

export default function QuizResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const score = parseInt(searchParams.get('score') || '0');
  const correct = parseInt(searchParams.get('correct') || '0');
  const total = parseInt(searchParams.get('total') || '0');

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-500', message: '완벽해요!' };
    if (score >= 80) return { grade: 'A', color: 'text-green-400', message: '훌륭해요!' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-500', message: '잘했어요!' };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-500', message: '괜찮아요!' };
    return { grade: 'D', color: 'text-red-500', message: '좀더 노력하세요!' };
  };

  const { grade, color, message } = getGrade(score);

  const handleRetry = () => {
    router.push(`/quiz/${id}/play`);
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-8 p-8 bg-white">
      <div className="text-center">
        <div className="text-2xl font-semibold text-gray-700 mb-4">{message}</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">퀴즈 완료!</h1>
        <p className="text-gray-600">수고하셨습니다</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            결과
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-6xl font-bold ${color} mb-2`}>
              {score}%
            </div>
            <div className={`text-2xl font-semibold ${color}`}>
              {grade}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">정답</span>
              <span className="font-semibold text-green-600">{correct}문제</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">오답</span>
              <span className="font-semibold text-red-600">{total - correct}문제</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <span className="text-gray-600">총 문제</span>
              <span className="font-bold">{total}문제</span>
            </div>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-4">
            <div
              className="bg-gray-500 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${score}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handleRetry}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          다시 풀기
        </Button>
        <Button
          onClick={handleHome}
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          홈으로
        </Button>
      </div>
    </main>
  );
}