import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";


 // 支払いリクエストを処理する関数
export async function POST(req: Request) {
 
  const { price, quantity = 1 } = await req.json();
  const userSession = await auth();
  const userId = userSession?.user?.id;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })

  let customer;

  if (user?.stripeCustomerId) {
    // ユーザーがすでに Stripe カスタマー ID を持っている場合
    customer = { id: user.stripeCustomerId };
  } else {
    // ユーザーが Stripe カスタマー ID を持っていない場合、新規作成する
    const customerData: { metadata: { dbId: string } } = { metadata: { dbId: userId } };
    const response = await stripe.customers.create(customerData);

    customer = { id: response.id };

    // データベースに Stripe カスタマー ID を保存する
    await db
      .update(users)
      .set({
        stripeCustomerId: customer.id,
      })
      .where(eq(users.id, userId));
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // Stripe チェックアウトセッションを作成する
    const session = await stripe.checkout.sessions.create({
      success_url: `${baseUrl}/billing/payment/success`,
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price,
          quantity
        }
      ],
      mode: "subscription",
    })

    if (session) {
      return new Response(JSON.stringify({ sessionId: session.id }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ error: "Failed to create checkout session" }), { status: 500 });
    }
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: "Failed to create checkout session" }), { status: 500 });
  }
}