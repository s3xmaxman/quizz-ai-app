import {
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
    serial,
    boolean,
    pgEnum,
  } from "drizzle-orm/pg-core";
import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";



export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(), // ユーザーの一意のID
  name: text("name"), // ユーザーの名前
  email: text("email").notNull(), // ユーザーのメールアドレス
  emailVerified: timestamp("emailVerified", { mode: "date" }), // メールアドレスの検証日時
  image: text("image"), // ユーザーのプロフィール画像
  stripeCustomerId: text("stripe_customer_id"), // ストライプのカスタマーID
  subscribed: boolean("subscribed"), // ユーザーがサブスクライブしているかどうか
});

export const usersRelations = relations(users, ({ many }) => ({
  quizzes: many(quizzes), // ユーザーが作成したクイズ
}));

export const accounts = pgTable("account", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // ユーザーIDへの参照
  type: text("type").$type<AdapterAccount["type"]>().notNull(), // アカウントのタイプ
  provider: text("provider").notNull(), // アカウントのプロバイダー (Google, Facebookなど)
  providerAccountId: text("providerAccountId").notNull(), // プロバイダー固有のアカウントID
  refresh_token: text("refresh_token"), // リフレッシュトークン
  access_token: text("access_token"), // アクセストークン
  expires_at: integer("expires_at"), // トークンの有効期限
  token_type: text("token_type"), // トークンのタイプ
  scope: text("scope"), // トークンのスコープ
  id_token: text("id_token"), // IDトークン
  session_state: text("session_state"), // セッション状態
},
(account) => ({
  compoundKey: primaryKey({
    columns: [account.provider, account.providerAccountId], // プロバイダーとアカウントIDを複合キーとして設定
  }),
})
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(), // セッショントークン
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // ユーザーIDへの参照
  expires: timestamp("expires", { mode: "date" }).notNull(), // セッションの有効期限
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(), // 識別子 (メールアドレスなど)
    token: text("token").notNull(), // 検証トークン
    expires: timestamp("expires", { mode: "date" }).notNull(), // トークンの有効期限
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }), // 識別子とトークンを複合キーとして設定
  })
);

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(), // クイズの一意のID
  name: text("name"), // クイズの名前
  description: text("description"), // クイズの説明
  userId: text("user_id").references(() => users.id), // 作成したユーザーのIDへの参照
});

export const quizzesRelations = relations(quizzes, ({ many, one }) => ({
  questions: many(questions), // クイズに関連する質問
  submissions: many(quizzSubmissions), // クイズの提出結果
}));

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(), // 質問の一意のID
  questionText: text("question_text"), // 質問のテキスト
  quizzId: integer("quizz_id"), // 関連するクイズのID
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quizz: one(quizzes, {
    fields: [questions.quizzId],
    references: [quizzes.id],
  }), // 関連するクイズ
  answers: many(questionAnswers), // 質問に関連する回答
}));

export const questionAnswers = pgTable("answers", {
  id: serial("id").primaryKey(), // 回答の一意のID
  questionId: integer("question_id"), // 関連する質問のID
  answerText: text("answer_text"), // 回答のテキスト
  isCorrect: boolean("is_correct"), // 正解かどうか
});

export const questionAnswersRelations = relations(questionAnswers, ({ one }) => ({
  question: one(questions, {
    fields: [questionAnswers.questionId],
    references: [questions.id],
  }), // 関連する質問
}));

export const quizzSubmissions = pgTable("quizz_submissions", {
  id: serial("id").primaryKey(), // 提出結果の一意のID
  quizzId: integer("quizz_id"), // 関連するクイズのID
  score: integer("score"), // スコア
  createdAt: timestamp("created_at").defaultNow().notNull(), // 提出日時
});

export const quizzSubmissionsRelations = relations(quizzSubmissions, ({ one, many }) => ({
  quizz: one(quizzes, {
    fields: [quizzSubmissions.quizzId],
    references: [quizzes.id],
  }), // 関連するクイズ
}));