import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createSubscription, deleteSubscription } from "@/app/actions/userSubscriptions";


const relevantEvents = new Set([
    "checkout.session.completed",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "customer.subscription.created",
]);



export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("Stripe-Signature");

  const webHookSecret =
      process.env.NODE_ENV === "production"
    ? process.env.STRIPE_WEBHOOK_SECRET
    : process.env.STRIPE_WEBHOOK_LOCAL_SECRET;

  
  if(!webHookSecret) {
    throw new Error("Stripe webhook secret not provided");
  };

  if (!sig) {
    throw new Error("No Stripe signature found");
  };

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    webHookSecret
  );

  const data = event.data.object as Stripe.Subscription;
  
  if (relevantEvents.has(event.type)) {
    switch (event.type) {
      case "customer.subscription.created": {
        await createSubscription({
          stripeCustomerId: data.customer as string,
        });
        break;
      }
      case "customer.subscription.deleted": {
        await deleteSubscription({
          stripeCustomerId: data.customer as string,
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });

}