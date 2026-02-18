export async function validateAdminRequest(
  request: Request
): Promise<{ ok: true } | { ok: false; response: Response }> {
  const key = request.headers.get("X-Admin-API-Key");
  const expected = process.env.ADMIN_API_KEY;
  if (!expected || key !== expected) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: "Unauthorized", message: "Invalid or missing X-Admin-API-Key" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
    };
  }
  return { ok: true };
}
