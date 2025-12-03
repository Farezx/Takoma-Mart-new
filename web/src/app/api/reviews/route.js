import sql from "../utils/sql";

// Get reviews for a product or all reviews
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id");
    const limit = parseInt(searchParams.get("limit")) || 10;
    const offset = parseInt(searchParams.get("offset")) || 0;

    let query = `
      SELECT r.*, u.first_name, u.last_name, p.name as product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.is_approved = true
    `;
    const params = [];
    let paramIndex = 1;

    if (productId) {
      query += ` AND r.product_id = $${paramIndex}`;
      params.push(productId);
      paramIndex++;
    }

    query += ` ORDER BY r.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const reviews = await sql(query, params);

    return Response.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return Response.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// Create a new review
export async function POST(request) {
  try {
    const { user_id, product_id, rating, title, comment } =
      await request.json();

    if (!user_id || !product_id || !rating) {
      return Response.json(
        { error: "User ID, product ID, and rating are required" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Check if user has already reviewed this product
    const existingReview = await sql`
      SELECT id FROM reviews WHERE user_id = ${user_id} AND product_id = ${product_id}
    `;

    if (existingReview.length > 0) {
      return Response.json(
        { error: "You have already reviewed this product" },
        { status: 400 },
      );
    }

    // Create the review
    const result = await sql`
      INSERT INTO reviews (user_id, product_id, rating, title, comment)
      VALUES (${user_id}, ${product_id}, ${rating}, ${title}, ${comment})
      RETURNING *
    `;

    // Update product's average rating and review count
    await sql`
      UPDATE products SET 
        average_rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ${product_id}),
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ${product_id})
      WHERE id = ${product_id}
    `;

    return Response.json({ review: result[0] });
  } catch (error) {
    console.error("Error creating review:", error);
    return Response.json({ error: "Failed to create review" }, { status: 500 });
  }
}
