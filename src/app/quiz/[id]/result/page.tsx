"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { RotateCcw, Home } from "lucide-react";

export default function QuizResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const score = parseInt(searchParams.get('score') || '0');
  const correct = parseInt(searchParams.get('correct') || '0');
  const total = parseInt(searchParams.get('total') || '0');

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', color: 'bg-black', message: '완벽해요!' };
    if (score >= 80) return { grade: 'A', color: 'bg-black', message: '훌륭해요!' };
    if (score >= 70) return { grade: 'B', color: 'bg-black', message: '잘했어요!' };
    if (score >= 60) return { grade: 'C', color: 'bg-black', message: '괜찮아요!' };
    return { grade: 'D', color: 'bg-red-500', message: '좀더 노력하세요!' };
  };

  const { grade, color, message } = getGrade(score);

  const handleRetry = () => {
    router.push(`/quiz/${id}/play`);
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900">퀴즈 완료</h1>
            <p className="text-lg text-gray-600">{message}</p>
          </div>
          
          <div className="relative">
            <div className={`${color} rounded-3xl p-8 text-white`}>
              <div className="text-7xl font-black mb-2">{score}<span className="text-4xl">%</span></div>
              <div className="text-2xl font-bold">{grade}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-emerald-600">{correct}</div>
              <div className="text-sm text-gray-500">정답</div>
            </div>
            <div className="space-y-1 border-x border-gray-100">
              <div className="text-2xl font-bold text-red-500">{total - correct}</div>
              <div className="text-sm text-gray-500">오답</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-700">{total}</div>
              <div className="text-sm text-gray-500">총 문제</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>진행률</span>
              <span>{score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleRetry}
            className="flex-1 h-12 rounded-xl border-2 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            다시 풀기
          </Button>
          <Button
            onClick={handleHome}
            className="flex-1 h-12 rounded-xl bg-gray-900 hover:bg-gray-800 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            홈으로
          </Button>
        </div>
      </div>
    </main>
  );
}