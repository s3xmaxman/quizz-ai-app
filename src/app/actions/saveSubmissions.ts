"use server";

import { db } from "@/db";
import { quizzSubmissions } from "@/db/schema";
import { auth } from "@/auth";
import { InferInsertModel, eq } from "drizzle-orm";

type Submission = InferInsertModel<typeof quizzSubmissions>;


export async function saveSubmission(sub: Submission, quizzId: number) {
  // 提出結果とクイズIDを受け取り、新しい提出結果を保存する
  
  const { score } = sub; // 提出結果のスコアを取得
  
  // クイズ提出結果テーブルに新しい提出結果を挿入
  const newSubmission = await db
    .insert(quizzSubmissions)
    .values({
      quizzId, // クイズID
      score, // スコア
    })
    .returning({ insertId: quizzSubmissions.id }); // 挿入されたIDを返す
    
  const submissionId = newSubmission[0].insertId; // 新しい提出結果のIDを取得
  
  return submissionId; // 提出結果のIDを返す
}

