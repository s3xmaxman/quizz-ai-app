import { quizzes, questions, quizzSubmissions, users } from "@/db/schema";
import { auth } from "@/auth";
import { db } from "@/db";
import { count, eq, avg, sql } from "drizzle-orm";

// クイズ提出のヒートマップ データを取得します
const getHeatMapData = async () => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return null
  }

  // データベースからデータを取得する
  const data = await db
    .select({
      // クイズ提出の作成日時を選択する
      createdAt: quizzSubmissions.createdAt,
      // 各作成日時におけるクイズ提出の数をカウントし、整数としてキャストする
      count: sql<number>`cast(count(${quizzSubmissions.id}) as int)`,
    })
    // クイズ提出テーブルからデータを取得する
    .from(quizzSubmissions)
    // クイズ テーブルとユーザー テーブルを内部結合する
    .innerJoin(quizzes, eq(quizzSubmissions.quizzId, quizzes.id))
    .innerJoin(users, eq(quizzes.userId, users.id))
    // クイズ提出の作成日時ごとにグループ化する
    .groupBy(quizzSubmissions.createdAt)
  
  // 取得したデータを返す
  return { data }
}

export default getHeatMapData