import db from "../db.js";

export async function searchFaculty(rawQuery) {
  if (!rawQuery) return null;

  const query = rawQuery.trim().toLowerCase();
  const like = `%${query}%`;

  try {
    const sql = `
      SELECT *
      FROM \`Faculty\`
      WHERE LOWER(Name) LIKE ?
         OR LOWER(Department) LIKE ?
         OR LOWER(Email) LIKE ?
         OR LOWER(Office) LIKE ?
         OR LOWER(Link) LIKE ?
      LIMIT 25
    `;

    const [rows] = await db
      .promise()
      .query(sql, [like, like, like, like, like]);

    return rows.length > 0 ? rows : null;
  } catch (err) {
    console.error("❌ Faculty DB query failed:", err);
    return null;
  }
}
