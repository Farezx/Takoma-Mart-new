import sql from "../../utils/sql";

// Create Stripe payment intent
export async function POST(request) {
  try {
    const { orderId, amount, currency = "usd" } = await request.json();

    if (!orderId || !amount) {
      return Response.json(
        { error: "Order ID and amount are required" },
        { status: 400 },
      );
    }

    // Mock Stripe Payment Intent creation for now
    // In a real implementation, you would use:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({ ... });

    const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substring(7)}`;

    // Update order with payment intent ID
    await sql`
      UPDATE orders 
      SET stripe_payment_intent_id = ${paymentIntentId}, payment_status = 'processing'
      WHERE id = ${orderId}
    `;

    return Response.json({
      paymentIntentId,
      clientSecret,
      message: "Payment intent created successfully",
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return Response.json(
      { error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}

// Confirm payment
export async function PUT(request) {
  try {
    const { paymentIntentId, status } = await request.json();

    if (!paymentIntentId || !status) {
      return Response.json(
        { error: "Payment intent ID and status are required" },
        { status: 400 },
      );
    }

    const paymentStatus = status === "succeeded" ? "completed" : "failed";
    const orderStatus = status === "succeeded" ? "confirmed" : "cancelled";

    // Update order payment status
    const result = await sql`
      UPDATE orders 
      SET payment_status = ${paymentStatus}, status = ${orderStatus}, updated_at = NOW()
      WHERE stripe_payment_intent_id = ${paymentIntentId}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({
      order: result[0],
      message: `Payment ${status}`,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return Response.json(
      { error: "Failed to confirm payment" },
      { status: 500 },
    );
  }
}
