import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const url = `https://groww.in/v1/api/search/v3/query/global/st_query?from=0&query=${query}&size=20&web=true`;

    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    return NextResponse.json({
      results: data?.data?.content || [],
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message, results: [] },
      { status: 500 }
    );
  }
}
