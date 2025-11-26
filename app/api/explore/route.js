// app/api/market/explore/route.js
import fetch from "node-fetch";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const discoveryType = searchParams.get("discoveryType");
  const page = searchParams.get("page") || "0";
  const size = searchParams.get("size") || "5";

  try {
    if (!discoveryType) {
      throw new Error("discoveryType parameter is required");
    }

    const res = await fetch(
      `https://groww.in/v1/api/stocks_data/v2/explore/list/top?discoveryFilterTypes=${discoveryType}&page=${page}&size=${size}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch market data");
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}