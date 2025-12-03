import sql from "../utils/sql";

// Get user's cart items
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const cartItems = await sql`
      SELECT ci.*, p.name, p.price, p.image_url, p.stock_quantity,
             (ci.quantity * p.price) as item_total
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ${userId} AND p.is_active = true
      ORDER BY ci.created_at DESC
    `;

    const total = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.item_total),
      0,
    );

    return Response.json({
      cartItems,
      total: total.toFixed(2),
      itemCount: cartItems.length,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return Response.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// Add item to cart
export async function POST(request) {
  try {
    const { userId, productId, quantity, notes } = await request.json();

    if (!userId || !productId || !quantity) {
      return Response.json(
        { error: "User ID, product ID, and quantity are required" },
        { status: 400 },
      );
    }

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT * FROM cart_items 
      WHERE user_id = ${userId} AND product_id = ${productId}
    `;

    if (existingItem.length > 0) {
      // Update existing item quantity
      const result = await sql`
        UPDATE cart_items 
        SET quantity = quantity + ${quantity}, notes = ${notes || existingItem[0].notes}, updated_at = NOW()
        WHERE user_id = ${userId} AND product_id = ${productId}
        RETURNING *
      `;
      return Response.json({ cartItem: result[0] });
    } else {
      // Insert new item
      const result = await sql`
        INSERT INTO cart_items (user_id, product_id, quantity, notes)
        VALUES (${userId}, ${productId}, ${quantity}, ${notes})
        RETURNING *
      `;
      return Response.json({ cartItem: result[0] });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return Response.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

// Update cart item
export async function PUT(request) {
  try {
    const { cartItemId, quantity, notes } = await request.json();

    if (!cartItemId) {
      return Response.json(
        { error: "Cart item ID is required" },
        { status: 400 },
      );
    }

    if (quantity && quantity <= 0) {
      // Remove item if quantity is 0 or less
      await sql`DELETE FROM cart_items WHERE id = ${cartItemId}`;
      return Response.json({ message: "Item removed from cart" });
    }

    const result = await sql`
      UPDATE cart_items 
      SET quantity = ${quantity}, notes = ${notes}, updated_at = NOW()
      WHERE id = ${cartItemId}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Cart item not found" }, { status: 404 });
    }

    return Response.json({ cartItem: result[0] });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return Response.json(
      { error: "Failed to update cart item" },
      { status: 500 },
    );
  }
}

// Clear entire cart
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    await sql`DELETE FROM cart_items WHERE user_id = ${userId}`;
    return Response.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return Response.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
