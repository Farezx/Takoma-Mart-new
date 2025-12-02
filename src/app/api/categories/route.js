import sql from "../utils/sql";

// Get all categories
export async function GET(request) {
  try {
    const categories = await sql`
      SELECT * FROM categories 
      WHERE is_active = true 
      ORDER BY name
    `;

    return Response.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

// Create new category (Admin only)
export async function POST(request) {
  try {
    const { name, description, image_url } = await request.json();

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO categories (name, description, image_url)
      VALUES (${name}, ${description}, ${image_url})
      RETURNING *
    `;

    return Response.json({ category: result[0] });
  } catch (error) {
    console.error("Error creating category:", error);
    return Response.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
