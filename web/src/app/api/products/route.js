import sql from "../utils/sql";

// Get all products with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = true
    `;
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND p.category_id = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (search) {
      query += ` AND (LOWER(p.name) LIKE LOWER($${paramIndex}) OR LOWER(p.description) LIKE LOWER($${paramIndex}))`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ` ORDER BY p.name LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const products = await sql(query, params);

    return Response.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// Create new product (Admin only)
export async function POST(request) {
  try {
    const {
      name,
      description,
      price,
      image_url,
      category_id,
      stock_quantity,
      weight,
      brand,
      sku,
    } = await request.json();

    if (!name || !price || !category_id) {
      return Response.json(
        { error: "Name, price, and category are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO products (name, description, price, image_url, category_id, stock_quantity, weight, brand, sku)
      VALUES (${name}, ${description}, ${price}, ${image_url}, ${category_id}, ${stock_quantity || 0}, ${weight}, ${brand}, ${sku})
      RETURNING *
    `;

    return Response.json({ product: result[0] });
  } catch (error) {
    console.error("Error creating product:", error);
    return Response.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
