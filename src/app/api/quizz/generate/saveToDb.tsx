import { db } from "@/db";
import { quizzes, questions as dbQuestions, questionAnswers } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";

type Quizz = InferInsertModel<typeof quizzes>;
type Question = InferInsertModel<typeof dbQuestions>;
type Answer = InferInsertModel<typeof questionAnswers>;

interface SaveQuizzData extends Quizz {
  questions: Array<Question & { answers?: Answer[] }>;
}

export default async function saveQuizz(quizzData: SaveQuizzData) {
  // クイズデータをデータベースに保存する関数
  const { name, description, questions } = quizzData; // クイズデータから必要なプロパティを抽出

  // クイズデータを挿入し、挿入されたクイズのIDを取得
  const newQuizz = await db
    .insert(quizzes)
    .values({
      name, // クイズの名前
      description // クイズの説明
    })
    .returning({ insertedId: quizzes.id }); // 挿入されたクイズのIDを取得
  const quizzId = newQuizz[0].insertedId; // クイズのIDを取得

  // トランザクション内で質問と回答をデータベースに保存
  await db.transaction(async (tx) => {
    // それぞれの質問をループ
    for (const question of questions) {
      // 質問を挿入し、挿入された質問のIDを取得
      const [{ questionId }] = await tx
        .insert(dbQuestions)
        .values({
          questionText: question.questionText, // 質問のテキスト
          quizzId // 質問が属するクイズのID
        })
        .returning({ questionId: dbQuestions.id }); // 挿入された質問のIDを取得

      // 質問に回答がある場合、回答をデータベースに挿入
      if (question.answers && question.answers.length > 0) {
        await tx.insert(questionAnswers).values(
          // それぞれの回答をマップし、質問IDとともに挿入
          question.answers.map((answer) => ({
            answerText: answer.answerText, // 回答のテキスト
            isCorrect: answer.isCorrect, // 正解かどうか
            questionId // 回答が属する質問のID
          }))
        )
      }
    }
  })

  return { quizzId };
}