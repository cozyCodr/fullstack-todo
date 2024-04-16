import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

const API_URL = process.env.BASE_API_URL;
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "defaultCookie";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { username, password } = await req.json();
    const url = `${API_URL}/api/v1/auth/register`;
    const response = await fetch(`${url}`, {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return new Response(JSON.stringify(data), {
        status: 200,
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