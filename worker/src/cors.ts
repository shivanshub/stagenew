export const CORS_HEADERS = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
});

export function handleOptions(request: Request, allowedOrigin: string): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS(allowedOrigin),
  });
}

export function jsonResponse(
  data: unknown,
  status: number,
  allowedOrigin: string
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS(allowedOrigin),
    },
  });
}
