import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"

const API_URL = process.env.BASE_API_URL;
const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "defaultCookie";


// DELETE todo
export async function DELETE(req: NextRequest, context: { params: { id: number } }) {
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
    const id = context.params.id;

    const response = await fetch(`${API_URL}/api/v1/todo/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      method: "DELETE"
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

// UPDATE todo
export async function PATCH(req: NextRequest, context: { params: { id: number } }) {
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
    const id = context.params.id;
    const { content, complete } = await req.json();

    const response = await fetch(`${API_URL}/api/v1/todo/${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "PATCH",
      body: JSON.stringify({
        complete,
        content
      })
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

