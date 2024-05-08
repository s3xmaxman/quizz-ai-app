"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import { ChevronLeft, X } from "lucide-react";
import ResultCard from "./ResultCard";
import QuizzSubmission from "./QuizzSubmission";
import { InferSelectModel } from "drizzle-orm";
import { questionAnswers, questions as DbQuestions, quizzes } from "@/db/schema";
// import { saveSubmission } from "@/actions/saveSubmissions";
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
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const router = useRouter();
  
    const handleNext = () => {
      if(!started) {
          setStarted(true);
          return;
      }
  
      if(currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
      } else {
          setSubmitted(true);
          return
      }
  
      setIsCorrect(null);
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
      
      setIsCorrect(isCurrentCorrect);
    }

    const handleSubmit = async () => {}
    
    const handleExit = () => {
        router.push("/");
    }

  
    const scorePercentage = Math.round((score / questions.length) * 100);
    const selectedAnswer: number | null | undefined = userAnswer.find(answer => answer.questionId === currentQuestion)?.answerId;
  
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
                              size="xl" 
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
          <Button 
              variant={"neo"} 
              size={"lg"} 
              onClick={handleNext}
          >
              {!started ? 'Start' : (currentQuestion === questions.length - 1) ? 'Submit' : 'Next'}
          </Button>
        </footer>
      </div>
    )
  }
  