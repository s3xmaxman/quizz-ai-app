import { quizzes, questions, quizzSubmissions, users } from "@/db/schema";
import { auth } from "@/auth";
import { db } from "@/db";
import { count, eq, avg } from "drizzle-orm";


const getUserMetrics = async () => {

  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  
// ユーザーが所有するクイズの数を取得
  const numQuizzes = await db
    .select({ value: count() })
    .from(quizzes)
    .where(eq(quizzes.userId, userId));
  

  // ユーザーが所有するクイズの質問の数を取得
  const numQuestions = await db
    .select({ value: count() })
    .from(questions)
    .innerJoin(quizzes, eq(questions.quizzId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(users.id, userId));
  
  
  // ユーザーが所有するクイズの提出結果の数を取得
  const numSubmissions = await db
    .select({ value: count() })
    .from(quizzSubmissions)
    .innerJoin(quizzes, eq(quizzSubmissions.quizzId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(users.id, userId));
  
  
  // ユーザーが所有するクイズの平均スコアを取得
  const avgScore = await db
    .select({ value: avg(quizzSubmissions.score) })
    .from(quizzSubmissions)
    .innerJoin(quizzes, eq(quizzSubmissions.quizzId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    .where(eq(users.id, userId));
  
  
  return [
    { label: "クイズ数", value: numQuizzes[0].value },
    { label: "問題の数", value: numQuestions[0].value },
    { label: "完了回数", value: numSubmissions[0].value },
    { label: "平均スコア", value: avgScore[0].value },
  ];
  
}


export default getUserMetrics