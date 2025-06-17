"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Play } from "lucide-react";
import { checkAnswer } from "@/shared/api/checkAnswer";

interface Quiz {
  id: string;
  question: string;
  description: string;
  image?: {
    id: string;
    filename: string;
    path: string;
  };
}

export function QuizPlay() {
  const { id } = useParams();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    async function loadQuizzes() {
      try {
        console.log('보드 ID로 퀴즈 목록 로딩:', id);
        
        const response = await fetch(`https://piko.alpa.dev/quiz/board/${id}`, {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('퀴즈 목록 응답:', data);
        
        if (data.status === 200 && Array.isArray(data.data)) {
          setQuizzes(data.data);
        } else {
          throw new Error('퀴즈 데이터가 올바르지 않습니다');
        }
        
      } catch (err) {
        console.error('퀴즈 로딩 실패:', err);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadQuizzes();
    }
  }, [id]);

  const currentQuiz = quizzes[currentQuizIndex];
  const isLastQuiz = currentQuizIndex === quizzes.length - 1;

  const handleSubmit = async () => {
    if (!answer.trim() || !currentQuiz) return;
    
    setChecking(true);
    try {
      console.log('정답 확인 요청:', currentQuiz.id, answer);
      
      const response = await checkAnswer(currentQuiz.id, answer.trim());
      console.log('정답 확인 응답:', response);
      
      if (response.data && response.data.isCorrect) {
        setResult("correct");
      } else {
        setResult("wrong");
        if (response.data && response.data.correctAnswer) {
          setCorrectAnswer(response.data.correctAnswer);
        }
      }
      
    } catch (error) {
      console.error('정답 확인 에러:', error);
      alert('정답 확인 중 오류가 발생했습니다.');
    } finally {
      setChecking(false);
    }
  };

  const handleNext = () => {
    if (isLastQuiz) {
      alert("퀴즈 완료! 결과 페이지로 이동");
    } else {
      setCurrentQuizIndex(prev => prev + 1);
      setResult(null);
      setAnswer("");
      setCorrectAnswer("");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center gap-8 p-8">
        <div className="w-[400px] h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">퀴즈 로딩 중...</span>
        </div>
      </main>
    );
  }

  if (!currentQuiz) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center gap-8 p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">퀴즈가 없습니다</h2>
          <p className="text-gray-600">이 보드에는 아직 퀴즈가 등록되지 않았습니다.</p>
        </div>
      </main>
    );
  }

  const imageSrc = currentQuiz.image?.path 
    ? `https://s3.alpa.dev/piko/${currentQuiz.image.path}`
    : "/thumbnails/poketmon.png";

  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-8 p-8">
      <div className="w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            {currentQuizIndex + 1} / {quizzes.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuizIndex + 1) / quizzes.length) * 100}%` }}
          />
        </div>
      </div>

      <img
        src={imageSrc}
        alt="문제 이미지"
        className="w-[400px] max-w-full h-auto object-contain rounded-lg shadow-lg"
      />

      <div className="text-center max-w-lg">
        <h2 className="text-xl font-bold mb-4">{currentQuiz.question}</h2>
        {currentQuiz.description && (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-left font-mono text-sm border">
            <div className="flex items-center mb-2">
              <div className="flex gap-1 mr-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <pre className="whitespace-pre-wrap overflow-x-auto">
              <code>{currentQuiz.description}</code>
            </pre>
          </div>
        )}
      </div>

      {result === "wrong" && (
        <div className="text-center">
          <p className="text-lg font-semibold text-red-500">오답!</p>
          {correctAnswer && (
            <p className="text-xl font-bold mt-2 text-blue-600">정답: {correctAnswer}</p>
          )}
        </div>
      )}

      {result === "correct" && (
        <p className="text-center text-green-500 text-2xl font-bold">정답!</p>
      )}

      {result ? (
        <Button onClick={handleNext} className="mt-4 flex items-center gap-2">
          {isLastQuiz ? "완료" : "다음"}
          <Play className="w-5 h-5" />
        </Button>
      ) : (
        <div className="flex w-full max-w-lg gap-2">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="정답을 입력하세요"
            disabled={checking}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button onClick={handleSubmit} disabled={checking || !answer.trim()}>
            {checking ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
        </div>
      )}
    </main>
  );
}