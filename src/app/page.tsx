"use client";

import { useState, useEffect } from "react";
import Header from "@/widgets/Header/Header";
import SearchBar from "@/widgets/SearchBar/SearchBar";
import QuizGrid from "@/widgets/QuizGrid/QuizGrid";

const initialData = [
  {
    id: 1,
    title: "국기 보고 나라 맞추기",
    description: "국기를 보고 어느 나라 국기인지 맞추는 퀴즈입니다",
    thumbnail: "/thumbnails/poketmon.png",
  },
  {
    id: 2,
    title: "2024년 밈 맞추기",
    description: "강 재미로들 하세요",
    thumbnail: "/thumbnails/poketmon.png",
  },
];

export default function Home() {
  const [quizzes, setQuizzes] = useState(initialData);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const newQuizzes = JSON.parse(localStorage.getItem("newQuizzes") || "[]");
    setQuizzes([...initialData, ...newQuizzes]);
  }, []);

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(search.toLowerCase()) ||
      quiz.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main>
      <Header />
      <SearchBar search={search} setSearch={setSearch} />
      <QuizGrid quizzes={filteredQuizzes} />
    </main>
  );
}
