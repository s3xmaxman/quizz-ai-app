"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import { ChevronLeft, X } from "lucide-react";
import ResultCard from "./ResultCard";
import QuizzSubmission from "./QuizzSubmission";
import { InferSelectModel } from "drizzle-orm";
import { questionAnswers, questions as DbQuestions, quizzes } from "@/db/schema";
import { saveSubmission } from "@/actions/saveSubmissions";
import { useRouter } from "next/navigation";

type Answer = InferSelectModel<typeof questionAnswers>
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] }
type Quizz = InferSelectModel<typeof quizzes> & { questions: Question[] }

type Props = {
    quizz: Quizz
}

export default function QuizzQuestions( props : Props) {
  const { questions } = props.quizz;
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<{ questionId: number; answerId: number }[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const router = useRouter();
  
  const handleNext = () => {
      if (!started) {
        setStarted(true);
        return;
      }
    
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setSubmitted(true);
        return;
      }
  }
  

  const handlePrevious = () => {
        if(currentQuestion !== 0) {
            setCurrentQuestion(previousCurrentQuestion => previousCurrentQuestion - 1);
        }
  }
  
    const handleAnswer = (answer: Answer, questionId: number) => {
      const newUserAnswer = [
          ...userAnswer,
          {
            questionId,
            answerId: answer.id
          }
      ];
     
      setUserAnswer(newUserAnswer);

      const isCurrentCorrect = answer.isCorrect;
      
      if(isCurrentCorrect) {
          setScore(score + 1);
      }

    }

  const handleSubmit = async () => {
     try {
      const submissionId = await saveSubmission({ score }, props.quizz.id);
     } catch (error) {
      console.log(error);
     }
    setSubmitted(true);
  }
    
  const handleExit = () => {
        router.push("/dashboard");
  }

  
  const scorePercentage = Math.round((score / questions.length) * 100);
  const selectedAnswer: number | null | undefined = userAnswer.find(answer => answer.questionId === questions[currentQuestion].id)?.answerId;
  const isCorrect: boolean | null | undefined = questions[currentQuestion].answers.findIndex((answer) => answer.id === selectedAnswer) !== -1 
                                                ? questions[currentQuestion].answers.find((answer) => answer.id === selectedAnswer)?.isCorrect 
                                                : null;
  
  if(submitted) {
    return (
        <QuizzSubmission
            score={score}
            scorePercentage={scorePercentage}
            totalQuestions={questions.length}
        />
    )
  }
  
  return (
      <div className="flex flex-col flex-1">
          <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
             <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
                  <Button onClick={handlePrevious} size={"icon"} variant={"outline"}><ChevronLeft /></Button>
                  <ProgressBar value={(currentQuestion / questions.length) * 100} />        
                  <Button onClick={handleExit} size={"icon"} variant={"outline"}><X /></Button>
             </header>
          </div>
        <main className="flex justify-center flex-1">
          {!started ? (
              <h1 className="text-3xl font-bold">
                  Welcome to the quizz page👋
              </h1>
          ) : (
             <div >
                  <h2 className="text-3xl font-semibold">
                      {questions[currentQuestion].questionText}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 mt-6">
                  {questions[currentQuestion].answers.map(answer => {
                      const variant = selectedAnswer === answer.id ? (answer.isCorrect ? "neoSuccess" : "neoDanger") : "neoOutline";
                      return (
                          <Button 
                              key={answer.id} 
                              variant={variant} 
                              disabled={!!selectedAnswer}
                              size="xl" 
                              className="disabled:opacity-100"
                              onClick={() => handleAnswer(answer, questions[currentQuestion].id)}
                            >
                              <p className="whitespace-normal">
                                  {answer.answerText}
                              </p>
                          </Button>
                      )
                  })}
                  </div>
             </div>
          )}
        </main>
        <footer className="footer pb-9 px-6 relative mb-0">
          <ResultCard 
              isCorrect={isCorrect} 
              correctAnswer={questions[currentQuestion].answers.find(answer => answer.isCorrect === true)?.answerText || ""}  
          />
          {(currentQuestion === questions.length - 1) ? (
            <Button 
              variant="neo" 
              size="lg" 
              onClick={handleSubmit}
            >
              結果を見る
            </Button>) : (
            <Button 
              variant="neo" 
              size="lg" 
              onClick={handleNext}
            >
              {!started ? 'スタート' : '次へ'}
            </Button>
          )}
        </footer>
      </div>
    )
}
  