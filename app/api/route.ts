import { NextResponse } from "next/server";
import { corsHeaders } from "@/app/utils/cors";

export async function OPTIONS(request: Request) {
  const response = new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Access-Control-Max-Age": "86400",
    },
  });

  return response;
}