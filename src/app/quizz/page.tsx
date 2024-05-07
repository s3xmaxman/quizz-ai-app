"use client";
import ProgressBar from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";

const questions = [
    {
      questionText: "Reactとは何ですか？",
      answers: [
        { answerText: "ユーザーインターフェースを構築するためのライブラリ", isCorrect: true, id: 1 },
        { answerText: "フロントエンドフレームワーク", isCorrect: false, id: 2 },
        { answerText: "バックエンドフレームワーク", isCorrect: false, id: 3 },
        { answerText: "データベース", isCorrect: false, id: 4 }
      ]
    },
    {
      questionText: "JSXとは何ですか？",
      answers: [
        { answerText: "JavaScript XML", isCorrect: true, id: 1 },
        { answerText: "JavaScript", isCorrect: false, id: 2 },
        { answerText: "JavaScriptとXML", isCorrect: false, id: 3 },
        { answerText: "JavaScriptとHTML", isCorrect: false, id: 4 }
      ]
    },
    {
      questionText: "仮想DOMとは何ですか？",
      answers: [
        { answerText: "DOMの仮想表現", isCorrect: true, id: 1 },
        { answerText: "実際のDOM", isCorrect: false, id: 2 },
        { answerText: "ブラウザの仮想表現", isCorrect: false, id: 3 },
        { answerText: "サーバーの仮想表現", isCorrect: false, id: 4 }
      ]
    }
];

export default function Home() {
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleNext = () => {
    if(!started) {
        setStarted(true);
        return;
    }

    if(currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        return;
    }
  }

  const handleAnswer = (answer: any) => {
    setSelectedAnswer(answer.id);
    const isCurrentCorrect = answer.isCorrect;
    if(isCurrentCorrect) {
        setScore(score + 1);
    }
    setIsCorrect(isCurrentCorrect);
  }

  return (
    <div className="flex flex-col flex-1">
        <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
           <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
                <Button size={"icon"} variant={"outline"}><ChevronLeft /></Button>
                <ProgressBar value={(currentQuestion / questions.length) * 100} />        
                <Button size={"icon"} variant={"outline"}><X /></Button>
           </header>
        </div>
      <main className="flex justify-center flex-1">
        {!started ? (
            <h1 className="text-3xl font-bold">
                Welcome to the quizz page!
            </h1>
        ) : (
           <div >
                <h2 className="text-3xl font-semibold">
                    {questions[currentQuestion].questionText}
                </h2>
                <div className="grid grid-cols-1 gap-6 mt-6">
                    {questions[currentQuestion].answers.map((answer) => (
                        <Button 
                            key={answer.id}
                            variant={"secondary"} 
                            onClick={() => handleAnswer(answer)}
                        >
                            {answer.answerText}
                        </Button>
                    ))}
                </div>
           </div>
        )}
      </main>
      <footer className="footer pb-9 px-6 relative mb-0">
        <Button onClick={handleNext}>Start</Button>
      </footer>
    </div>
  )
}
