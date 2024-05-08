import  { db } from "@/db";
import {  quizzes, questions as dbQuestions, questionAnswers } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";


type Question = InferInsertModel<typeof dbQuestions>
type Answer = InferInsertModel<typeof questionAnswers>
type Quizz = InferInsertModel<typeof quizzes>

interface SaveQuizzData extends Quizz {
  questions: Array<Question & { answers?: Answer[] }>;
}

export default async function saveQuizz(quizzData: SaveQuizzData) {

    // クイズデータから名前、説明、質問を取り出す
    const { name, description, questions } = quizzData;

    // クイズテーブルにクイズ名と説明を挿入し、新しいクイズIDを取得する
    const newQuizz = await db
      .insert(quizzes)
      .values({ name, description })
      .returning({ insertedId: quizzes.id });

    const quizzId = newQuizz[0].insertedId;  

    // トランザクション内で質問と回答を挿入する
    await db.transaction(async (tx) => {
        for (const question of questions) {
          // 質問テーブルに質問文とクイズIDを挿入し、新しい質問IDを取得する
          const [{ questionId }] = await tx
            .insert(dbQuestions)
            .values({
              questionText: question.questionText,
              quizzId,
            })
            .returning({ questionId: dbQuestions.id });
    
          // 回答が存在する場合は回答テーブルに回答文、正解フラグ、質問IDを挿入する
          if (question.answers && question.answers.length > 0) {
            await tx.insert(questionAnswers).values(
              question.answers.map((answer) => ({
                answerText: answer.answerText,
                isCorrect: answer.isCorrect,
                questionId
              }))
            )
          }
        }
    });
    
    // 新しく作成したクイズIDを返す
    return { quizzId };
}