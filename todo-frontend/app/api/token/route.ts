import { cookies } from "next/headers";

const COOKIE_NAME = process.env.NEXT_PUBLIC_COOKIE_NAME || "";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME);

    if (!token || token === undefined) {
      const response = {
        message: "Unauthorized",
        status: 401,
        data: null,
      };
      return new Response(JSON.stringify(response), {
        status: 401,
      });
    }

    const response = {
      message: "Fetched Token",
      token,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    const response = {
      message: "No tOken",
      status: 401,
      data: null,
    };
    return new Response(JSON.stringify(response), {
      status: 401,
    });
  }
}
