import React from 'react'
import { db } from "@/db";
import { eq } from 'drizzle-orm';
import { quizzes } from "@/db/schema";
import { auth } from "@/auth";
import QuizzesTable, { Quizz} from "./quizzesTable";
import getUserMetrics from '@/app/actions/getUserMetrics';


type Props = {}

const dashboard = async (props: Props) => {
  const session = await auth();
  const userId = session?.user?.id;
  const userData = await getUserMetrics();

  console.log(userData)
  
  if(!userId) {
    return (
        <p>User not found</p>
    )
  }
  
  const userQuizzes = await db.query.quizzes.findMany({
      where: eq(quizzes.userId, userId),
  })

//   console.log(userQuizzes)
    


  return (
    <QuizzesTable quizzes={userQuizzes} />
  )
}

export default dashboard