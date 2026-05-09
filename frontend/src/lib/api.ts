export const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export async function readJsonResponse<T = unknown>(
  response: Response,
  fallbackMessage = 'Request failed'
): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const body = await response.text();

  if (!body) return undefined as T;

  if (!contentType.includes('application/json')) {
    const snippet = body.replace(/\s+/g, ' ').trim().slice(0, 120);
    throw new Error(
      `${fallbackMessage}: expected JSON from ${response.url}, got ${response.status} ${response.statusText}${
        snippet ? ` (${snippet})` : ''
      }`
    );
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new Error(`${fallbackMessage}: invalid JSON from ${response.url}`);
  }
}
