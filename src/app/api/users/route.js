import sql from "../utils/sql";

// Get all users (Admin only)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;

    let query = `
      SELECT id, email, first_name, last_name, phone, role, is_verified, created_at
      FROM users 
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (role) {
      query += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const users = await sql(query, params);

    return Response.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// Create new user
export async function POST(request) {
  try {
    const {
      email,
      first_name,
      last_name,
      phone,
      role = "customer",
    } = await request.json();

    if (!email || !first_name || !last_name) {
      return Response.json(
        { error: "Email, first name, and last name are required" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO users (email, first_name, last_name, phone, role)
      VALUES (${email}, ${first_name}, ${last_name}, ${phone}, ${role})
      RETURNING id, email, first_name, last_name, phone, role, is_verified, created_at
    `;

    return Response.json({ user: result[0] });
  } catch (error) {
    if (error.message.includes("duplicate key value")) {
      return Response.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }
    console.error("Error creating user:", error);
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}
