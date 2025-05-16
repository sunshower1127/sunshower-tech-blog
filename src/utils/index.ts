export function getOrigin() {
  const host = process.env.NEXT_PUBLIC_VERCEL_URL || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = `${protocol}://${host}`;
  return origin;
}
