import { corsHeaders } from "./cors";

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}

export async function fetchWithAuth<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...corsHeaders,
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return res.json();
} 