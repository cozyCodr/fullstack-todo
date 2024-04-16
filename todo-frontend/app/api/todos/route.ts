import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"

const API_URL = process.env.BASE_API_URL;
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "defaultCookie";


// Get all todos
export async function GET() {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(COOKIE_NAME);

    if (!cookie || cookie === undefined) {
      const response = {
        message: "Unauthorized",
        status: 401,
        data: null,
      }
      return new Response((JSON.stringify(response)), {
        status: 401
      })
    }
    const { value: token } = cookie
    const response = await fetch(`${API_URL}/api/v1/todo/all`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
    })

    if (response.ok) {
      return response;
    }
    else {
      const data = await response.json();
      throw new Error(data.message);
    }
  }
  catch (e: any) {
    console.log(e);
    return NextResponse.json({
      message: e?.message,
      data: null,
      status: 500
    });
  }
}

// Create Todo
export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(COOKIE_NAME);

    if (!cookie || cookie === undefined) {
      const response = {
        message: "Unauthorized",
        status: 401,
        data: null,
      }
      return new Response((JSON.stringify(response)), {
        status: 401
      })
    }
    const { value: token } = cookie;
    const { content, complete } = await req.json();

    const response = await fetch(`${API_URL}/api/v1/todo`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ content, complete })

    })

    if (response.ok) {
      return response;
    }
    else {
      const data = await response.json();
      throw new Error(data.message);
    }
  }
  catch (e: any) {
    console.log(e);
    return NextResponse.json({
      message: e?.message,
      data: null,
      status: 500
    });
  }
}