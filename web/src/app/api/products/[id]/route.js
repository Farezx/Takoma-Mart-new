import sql from "../../utils/sql";

// Get single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ${id} AND p.is_active = true
    `;

    if (result.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ product: result[0] });
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// Update product (Admin only)
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();

    const setFields = [];
    const values = [];
    let paramIndex = 1;

    // Build dynamic update query
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== "id" && value !== undefined) {
        setFields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (setFields.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add updated_at timestamp
    setFields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE products SET ${setFields.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ product: result[0] });
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// Delete product (Admin only)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Soft delete by setting is_active to false
    const result = await sql`
      UPDATE products 
      SET is_active = false, updated_at = NOW() 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
