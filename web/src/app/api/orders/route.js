import sql from "../utils/sql";

// Get user's orders or all orders (admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;

    let query = `
      SELECT o.*, u.first_name, u.last_name, u.email,
             COUNT(oi.id) as item_count
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (userId) {
      query += ` AND o.user_id = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }

    if (status) {
      query += ` AND o.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` GROUP BY o.id, u.first_name, u.last_name, u.email`;
    query += ` ORDER BY o.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const orders = await sql(query, params);

    return Response.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Create new order
export async function POST(request) {
  try {
    const { userId, pickupTime, notes, paymentMethod } = await request.json();

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get cart items
    const cartItems = await sql`
      SELECT ci.*, p.name, p.price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ${userId} AND p.is_active = true
    `;

    if (cartItems.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.quantity * parseFloat(item.price),
      0,
    );
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Create order using transaction
    const [order, orderItems] = await sql.transaction([
      sql`
        INSERT INTO orders (user_id, total_amount, tax_amount, pickup_time, notes, payment_method)
        VALUES (${userId}, ${totalAmount.toFixed(2)}, ${taxAmount.toFixed(2)}, ${pickupTime}, ${notes}, ${paymentMethod})
        RETURNING *
      `,
      sql`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_time, notes)
        SELECT 
          (SELECT id FROM orders WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1),
          ci.product_id, 
          ci.quantity, 
          p.price, 
          ci.notes
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ${userId}
        RETURNING *
      `,
    ]);

    // Clear cart after creating order
    await sql`DELETE FROM cart_items WHERE user_id = ${userId}`;

    return Response.json({
      order: order[0],
      orderItems: orderItems,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
