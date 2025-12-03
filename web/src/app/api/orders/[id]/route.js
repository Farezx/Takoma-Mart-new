import sql from "../../utils/sql";

// Get single order with items
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Get order details
    const orderResult = await sql`
      SELECT o.*, u.first_name, u.last_name, u.email, u.phone
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ${id}
    `;

    if (orderResult.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    // Get order items
    const orderItems = await sql`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${id}
      ORDER BY oi.created_at
    `;

    return Response.json({
      order: orderResult[0],
      orderItems,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// Update order status
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { status, notes, pickup_time } = await request.json();

    const setFields = [];
    const values = [];
    let paramIndex = 1;

    if (status) {
      setFields.push(`status = $${paramIndex}`);
      values.push(status);
      paramIndex++;
    }

    if (notes !== undefined) {
      setFields.push(`notes = $${paramIndex}`);
      values.push(notes);
      paramIndex++;
    }

    if (pickup_time) {
      setFields.push(`pickup_time = $${paramIndex}`);
      values.push(pickup_time);
      paramIndex++;
    }

    if (setFields.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    setFields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE orders SET ${setFields.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ order: result[0] });
  } catch (error) {
    console.error("Error updating order:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}
