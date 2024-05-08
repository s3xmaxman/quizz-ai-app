import { db } from "@/db";

import { quizzes } from "@/db/schema";
import { eq } from 'drizzle-orm';
import QuizzQuestions from "../QuizzQuestions";


type Params = {
    params: {
        quizzId: string
    }
}

const page = async ( { params }: Params) => {
  const quizzId = params.quizzId;

  const quizz = await db.query.quizzes
    .findFirst({
      where: eq(quizzes.id, parseInt(quizzId)),
      with: {
        questions: {
          with: {
            answers: true
          }
        }
      }
    });

  if (!quizz || !quizzId || quizz.questions.length === 0) {
    return <div>Quizz not found</div>;
  }


  return (
    <QuizzQuestions quizz={quizz} />
  )
}

export default page