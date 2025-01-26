import { NextResponse, NextRequest } from "next/server";
import { getToken } from 'next-auth/jwt';
// import middleware from "next-auth/middleware";

import authConfig from "./auth.config"
import NextAuth from "next-auth"
// export { auth as middleware } from "@/auth"

const { auth } = NextAuth(authConfig)

// !! PROTECTED ROUTES !! //

// export default middleware
// Demo - this is technically already handled by NextAuth
// --   This is just to show how middleware works in NextJS 13
// export function middleware(request: NextRequest) {
//   // redirects to /new-page when it hits /users
//   return NextResponse.redirect(new URL('/new-page', request.url))
// }
// NextJS Convention - Next knows to look for this, same as layout,error,page,route,etc.
export const config = {
  // middleware only executed on this path 
  // *: zero or more parameters ie no matter what
  // +: one or more parameters ie one or more parameters 
  // ?: zero or one parameters ie (?)
  matcher: [
    '/dashboard/:path*',
    '/status/:path*',
    '/change-password',
    '/'
  ]
  // matcher: ['/users/:id*']
}


export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export default auth(async function middleware(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return NextResponse.json({}, { headers: corsHeaders })
  }

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const pathname = req.nextUrl.pathname;

  // Redirect signed-in users away from the homepage
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Allow unauthenticated users to access the homepage
  if (!token) {
    if (pathname === '/api/auth/signin') {
      return NextResponse.next(); // Allow access to the sign-in page
    } else if (pathname === '/') {
      return NextResponse.next(); // Proceed to homepage
    }

    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  // Allow authenticated users to access protected routes
  return NextResponse.next();
})

// export default auth((req) => {
//   if (!req.auth && req.nextUrl.pathname !== "/login") {
//     const newUrl = new URL("/login", req.nextUrl.origin)
//     return Response.redirect(newUrl)
//   }
// })
