"use client";

import { useState, useEffect } from "react";
import Header from "@/widgets/Header/Header";
import SearchBar from "@/widgets/SearchBar/SearchBar";
import QuizGrid from "@/widgets/QuizGrid/QuizGrid";
import { fetchAllBoards } from "@/shared/api/fetchAllBoards";

const initialData = [
  {
    id: 1,
    title: "국기 보고 나라 맞추기",
    description: "국기를 보고 어느 나라 국기인지 맞추는 퀴즈입니다",
    thumbnail: "/thumbnails/poketmon.png",
    difficulty: "EASY",
  },
  {
    id: 2,
    title: "2024년 밈 맞추기",
    description: "강 재미로들 하세요",
    thumbnail: "/thumbnails/poketmon.png",
    difficulty: "NORMAL",
  },
];

export default function Home() {
  const [quizzes, setQuizzes] = useState(initialData);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBoards() {
      try {
        const apiBoards = await fetchAllBoards();
        
        const formattedBoards = apiBoards.map((board: any) => ({
          id: board.id,
          title: board.title || "제목 없는 보드",
          description: board.description || "설명이 등록되지 않았습니다.",
          thumbnail: board.thumbnail?.path 
            ? `https://s3.alpa.dev/piko/${board.thumbnail.path}` 
            : "/thumbnails/poketmon.png",
          difficulty: board.difficulty || "EASY",
        }));

        const localQuizzes = JSON.parse(localStorage.getItem("newQuizzes") || "[]");
        setQuizzes([...formattedBoards, ...localQuizzes]);
      } catch (error) {
        console.error('보드 로딩 실패:', error);
        const localQuizzes = JSON.parse(localStorage.getItem("newQuizzes") || "[]");
        setQuizzes([...initialData, ...localQuizzes]);
      } finally {
        setLoading(false);
      }
    }

    loadBoards();
  }, []);

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(search.toLowerCase()) ||
      quiz.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <main>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div>보드를 불러오는 중...</div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Header />
      <SearchBar search={search} setSearch={setSearch} />
      <QuizGrid quizzes={filteredQuizzes} />
    </main>
  );
}