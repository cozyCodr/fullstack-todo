import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

const API_URL = process.env.BASE_API_URL;
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "defaultCookie";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const url = `${API_URL}/api/v1/auth/login`;
    const response = await fetch(`${url}`, {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    if (response.ok) {
      const { data } = await response.json();

      // When Token is returned. Add it to cookie. Cookie will be saved to browser
      const serialized = serialize(COOKIE_NAME, data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 2, // 2Hr
        path: "/",
      });

      const message = {
        message: "Authenticated",
        user: data.user,
      };
      return new Response(JSON.stringify(message), {
        status: 200,
        headers: { "Set-Cookie": serialized },
      });
    }
    else {
      return response
    }
  }
  catch (e: any) {
    console.log(e);
    return new Response(JSON.stringify({
      message: e?.message,
      data: null,
      status: 500
    }), { status: 500 });
  }
}