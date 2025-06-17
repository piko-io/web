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
import { fetchQuizDetails } from "@/shared/api/fetchQuizDetails";
import { updateQuizImage } from "@/shared/api/updateQuizImage";
import { updateQuiz } from "@/shared/api/updateQuiz";

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
        
        if (!boardId) {
          console.error('boardId가 없습니다');
          setQuizzes([]);
          return;
        }

        const data = await fetchBoardQuizzes(boardId);
        console.log('받아온 퀴즈 데이터:', data);
        
        // API 응답 구조 확인
        let quizArray = [];
        if (Array.isArray(data)) {
          quizArray = data;
        } else if (data && Array.isArray(data.data)) {
          quizArray = data.data;
        } else if (data && data.quizzes && Array.isArray(data.quizzes)) {
          quizArray = data.quizzes;
        } else {
          console.log('예상하지 못한 데이터 구조:', data);
          quizArray = [];
        }
        
        console.log('퀴즈 배열:', quizArray);
        
        const loadedQuizzes: Quiz[] = await Promise.all(
          quizArray.map(async (quiz: any, index: number) => {
            console.log(`퀴즈 ${index}:`, quiz);
            console.log('answers 필드:', quiz.answers);
            console.log('choices 필드:', quiz.choices);
            console.log('options 필드:', quiz.options);
            console.log('answer_list 필드:', quiz.answer_list);
            console.log('quiz의 모든 키:', Object.keys(quiz));
            
            // 답변 배열 찾기
            let answers = [];
            if (Array.isArray(quiz.answers) && quiz.answers.length > 0) {
              answers = quiz.answers;
            } else if (Array.isArray(quiz.choices) && quiz.choices.length > 0) {
              answers = quiz.choices;
            } else if (Array.isArray(quiz.options) && quiz.options.length > 0) {
              answers = quiz.options;
            } else if (Array.isArray(quiz.answer_list) && quiz.answer_list.length > 0) {
              answers = quiz.answer_list;
            } else if (typeof quiz.answers === 'string') {
              try {
                answers = JSON.parse(quiz.answers);
              } catch {
                answers = [quiz.answers];
              }
            } else {
              // 답변이 없으면 퀴즈 상세 정보 조회 시도
              console.log('답변 데이터가 없어서 상세 조회 시도:', quiz.id);
              try {
                if (quiz.id && quiz.id.length > 20) {
                  console.log('퀴즈 상세 조회 시작:', quiz.id);
                  const detailData = await fetchQuizDetails(quiz.id);
                  console.log('퀴즈 상세 데이터:', detailData);
                  
                  // 여러 가능한 데이터 구조 확인
                  if (Array.isArray(detailData.answers) && detailData.answers.length > 0) {
                    answers = detailData.answers;
                    console.log('detailData.answers에서 답변 찾음:', answers);
                  } else if (Array.isArray(detailData.choices) && detailData.choices.length > 0) {
                    answers = detailData.choices;
                    console.log('detailData.choices에서 답변 찾음:', answers);
                  } else {
                    console.log('상세 데이터에서도 답변을 찾을 수 없음. 전체 구조:', detailData);
                  }
                }
              } catch (detailError) {
                console.error('퀴즈 상세 조회 에러:', detailError);
              }
              
              // 여전히 답변이 없으면 빈 배열로 설정
              if (answers.length === 0) {
                console.warn('최종적으로 답변 데이터를 찾을 수 없습니다:', quiz);
                answers = [];
              }
            }
            
            return {
              id: quiz.id || `temp_${Date.now()}_${index}`,
              question: quiz.question || quiz.title || "",
              description: quiz.description || "",
              answers: answers,
              preview: quiz.image?.path ? `https://s3.alpa.dev/piko/${quiz.image.path}` : undefined,
            };
          })
        );
        
        console.log('변환된 퀴즈 데이터:', loadedQuizzes);
        setQuizzes(loadedQuizzes);
      } catch (error) {
        console.error('퀴즈 불러오기 실패:', error);
        console.error('에러 상세:', error.message);
        console.error('에러 스택:', error.stack);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    }

    if (boardId) {
      loadQuizzes();
    } else {
      setLoading(false);
    }
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

  const handleEditQuiz = async (quiz: Quiz) => {
    try {
      // 서버에 저장된 퀴즈인 경우 - 기존 데이터로 편집
      if (quiz.id.length > 20) {
        const fullQuizData: Quiz = {
          id: quiz.id,
          question: quiz.question,
          description: quiz.description,
          answers: quiz.answers,
          preview: quiz.preview,
          file: quiz.file,
        };
        
        setEditingQuiz(fullQuizData);
      } else {
        // 로컬에서만 생성된 퀴즈
        setEditingQuiz(quiz);
      }
    } catch (error) {
      console.error('퀴즈 편집 실패:', error);
      // 실패 시 기존 데이터로 편집
      setEditingQuiz(quiz);
    }
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
              file: data.file || q.file, // 새 파일이 없으면 기존 파일 유지
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
      // 새로 생성된 퀴즈만 저장 (ID가 짧은 것들)
      const newQuizzes = quizzes.filter(quiz => quiz.file && quiz.id.length <= 20);
      
      // 기존 퀴즈 중 변경된 것들 처리
      const updatedQuizzes = quizzes.filter(quiz => quiz.id.length > 20);
      
      console.log('새 퀴즈:', newQuizzes);
      console.log('수정된 기존 퀴즈:', updatedQuizzes);
      
      // 새 퀴즈 저장
      if (newQuizzes.length > 0) {
        await saveBoardQuizzes({ boardId, quizzes: newQuizzes });
      }
      
      // 기존 퀴즈 업데이트
      for (const quiz of updatedQuizzes) {
        try {
          console.log(`퀴즈 ${quiz.id} 업데이트 시작`);
          
          // 퀴즈 내용 업데이트 (question, description, answers)
          await updateQuiz(quiz.id, {
            question: quiz.question,
            description: quiz.description,
            answers: quiz.answers
          });
          
          // 이미지가 변경된 경우 이미지도 업데이트
          if (quiz.file) {
            console.log(`퀴즈 ${quiz.id}의 이미지 업데이트 시작`);
            await updateQuizImage(quiz.id, quiz.file);
            console.log(`퀴즈 ${quiz.id}의 이미지 업데이트 완료`);
          }
          
          console.log(`퀴즈 ${quiz.id} 업데이트 완료`);
        } catch (error) {
          console.error(`퀴즈 ${quiz.id} 업데이트 실패:`, error);
        }
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
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </div>
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
                onClick={() => handleEditQuiz(quiz)}
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