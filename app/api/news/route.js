// app/api/news/route.js
import fetch from "node-fetch";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 9;

  try {
    const res = await fetch(`https://groww.in/v1/api/groww_news/v1/stocks_news/news?page=${page}&size=${size}`);
    
    if (!res.ok) {
      throw new Error("Failed to fetch news");
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
