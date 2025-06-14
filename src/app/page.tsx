import Header from "@/widgets/Header/Header";
import SearchBar from "@/widgets/SearchBar/SearchBar";
import QuizGrid from "@/widgets/QuizGrid/QuizGrid";

export default function Home() {
  return (
    <main>
      <Header />
      <SearchBar />
      <QuizGrid />
    </main>
  );
}
