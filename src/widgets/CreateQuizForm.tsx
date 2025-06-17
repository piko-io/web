"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Pencil, Trash, Search } from "lucide-react";
import CreateQuizModal from "@/widgets/CreateQuizModal";
import { saveBoardQuizzes } from "@/shared/api/saveBoardQuizzes";
import { fetchBoardQuizzes } from "@/shared/api/fetchBoardQuizzes";
import { deleteQuiz } from "@/shared/api/deleteQuiz";

interface Quiz {
  id: string;
  preview?: string;
  question: string;
  description: string;
  answers: string[];
  file?: File;
}

export default function CreateQuizForm() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId as string;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [search, setSearch] = useState("");
  const [openNewQuiz, setOpenNewQuiz] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuizzes() {
      try {
        console.log('퀴즈 로딩 시작, boardId:', boardId);
        const data = await fetchBoardQuizzes(boardId);
        console.log('받아온 퀴즈 데이터:', data);
        
        const quizArray = Array.isArray(data) ? data : [];
        console.log('퀴즈 배열:', quizArray);
        
        const loadedQuizzes: Quiz[] = quizArray.map((quiz: any) => {
          console.log('개별 퀴즈 데이터:', quiz);
          console.log('answers 필드:', quiz.answers);
          console.log('choices 필드:', quiz.choices);
          console.log('options 필드:', quiz.options);
          console.log('answer_list 필드:', quiz.answer_list);
          console.log('quiz의 모든 키:', Object.keys(quiz));
          
          return {
            id: quiz.id || Date.now().toString(),
            question: quiz.question || "",
            description: quiz.description || "",
            answers: quiz.answers || quiz.choices || quiz.options || quiz.answer_list || [],
            preview: quiz.image?.path ? `https://s3.alpa.dev/piko/${quiz.image.path}` : undefined,
          };
        });
        
        console.log('변환된 퀴즈 데이터:', loadedQuizzes);
        setQuizzes(loadedQuizzes);
      } catch (error) {
        console.error('퀴즈 불러오기 실패:', error);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    }

    loadQuizzes();
  }, [boardId]);

  const handleCreateQuiz = (data: {
    file?: File;
    question: string;
    description: string;
    answers: string[];
  }) => {
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      preview: data.file ? URL.createObjectURL(data.file) : undefined,
      question: data.question,
      description: data.description,
      answers: data.answers,
      file: data.file,
    };
    setQuizzes((prev) => [...prev, newQuiz]);
  };

  const handleUpdateQuiz = (data: {
    file?: File;
    question: string;
    description: string;
    answers: string[];
  }) => {
    if (!editingQuiz) return;
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === editingQuiz.id
          ? {
              ...q,
              preview: data.file ? URL.createObjectURL(data.file) : q.preview,
              question: data.question,
              description: data.description,
              answers: data.answers,
              file: data.file,
            }
          : q
      )
    );
    setEditingQuiz(null);
  };

  const handleRemoveQuiz = async (quizId: string) => {
    try {
      if (quizId.length > 20) {
        await deleteQuiz(quizId);
        const data = await fetchBoardQuizzes(boardId);
        const quizArray = Array.isArray(data) ? data : [];
        const loadedQuizzes: Quiz[] = quizArray.map((quiz: any) => ({
          id: quiz.id || Date.now().toString(),
          question: quiz.question || "",
          description: quiz.description || "",
          answers: quiz.answers || quiz.choices || quiz.options || quiz.answer_list || [],
          preview: quiz.image?.path ? `https://s3.alpa.dev/piko/${quiz.image.path}` : undefined,
        }));
        setQuizzes(loadedQuizzes);
      } else {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
      }
    } catch (error) {
      console.error('퀴즈 삭제 실패:', error);
      alert('퀴즈 삭제에 실패했습니다.');
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.question.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    try {
      const newQuizzes = quizzes.filter(quiz => quiz.file);
      
      if (newQuizzes.length > 0) {
        await saveBoardQuizzes({ boardId, quizzes: newQuizzes });
      }
      
      router.push("/my-boards");
    } catch (error) {
      console.error('저장 실패:', error);
      router.push("/my-boards");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div>로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-start p-8 gap-6">
      <div className="w-full flex justify-between items-center">
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full max-w-xl">
        <Input
          placeholder="검색어를 입력하세요."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow"
        />
        <Button size="icon">
          <Search className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex gap-6 flex-wrap justify-start items-start">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="relative w-60 h-60 rounded-lg overflow-hidden shadow border cursor-pointer flex flex-col justify-between"
          >
            {quiz.preview ? (
              <img
                src={quiz.preview}
                alt="썸네일"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-center p-4 bg-gray-50">
                <p className="font-semibold text-black">
                  {quiz.question || "제목 없음"}
                </p>
              </div>
            )}

            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setEditingQuiz(quiz)}
              >
                <Pencil className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                onClick={() => handleRemoveQuiz(quiz.id)}
              >
                <Trash className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}

        <div
          onClick={() => setOpenNewQuiz(true)}
          className="border-2 border-dashed border-black rounded-lg p-12 text-center cursor-pointer hover:bg-gray-100 w-60 h-60 flex flex-col items-center justify-center"
        >
          <span className="text-4xl">+</span>
          <span className="mt-2 text-base">문제를 추가해보세요.</span>
        </div>
      </div>

      <CreateQuizModal
        open={openNewQuiz}
        onClose={() => setOpenNewQuiz(false)}
        onSubmit={handleCreateQuiz}
      />

      <CreateQuizModal
        open={!!editingQuiz}
        onClose={() => setEditingQuiz(null)}
        onSubmit={handleUpdateQuiz}
        initialData={editingQuiz ?? undefined}
      />
    </main>
  );
}