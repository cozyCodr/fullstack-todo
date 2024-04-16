import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone(); // REQUIRED FOR BASE ABSOLUTE URL

  const response = NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME);

  // IF NO TOKEN AND NOT ON AUTHENTICATION PAGES, REDIRECT TO LOGIN
  if (!token && !["/"].includes(pathname)) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  // IF TOKEN EXISTS AND USER TRIES TO ACCESS LOGIN OR SIGNUP, REDIRECT TO HOME
  else if (token && ["/"].includes(pathname)) {
    url.pathname = "/todos";
    return NextResponse.redirect(url);
  }

  // SET TOKEN IN HEADERS
  if (token) {
    response.headers.set("Authorization", `Bearer ${token}`);
  }

  return response;
}

export const config = {
  matcher: ["/", "/todos"],
};
