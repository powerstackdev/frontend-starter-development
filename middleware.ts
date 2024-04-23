import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const { cookies } = req
  const sessionToken = cookies.get("next-auth.session-token")

  if (req.method === "GET") {
    // Rewrite routes that match "/[...puckPath]/edit" to "/puck/[...puckPath]"
    if (req.nextUrl.pathname.endsWith("/edit")) {
      const pathWithoutEdit = req.nextUrl.pathname.slice(
        0,
        req.nextUrl.pathname.length - 5
      )
      const pathWithEditPrefix = `/edit${pathWithoutEdit}`

      if (!sessionToken) {
        return NextResponse.redirect(new URL("/api/auth/signin", req.url))
      }
      return NextResponse.rewrite(new URL(pathWithEditPrefix, req.url))
    }

    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/welcome", req.url))
    }

    if (req.nextUrl.pathname.startsWith("/admin") && !sessionToken) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url))
    }

    // Disable "/puck/[...puckPath]"
    if (req.nextUrl.pathname.startsWith("/puck")) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}
