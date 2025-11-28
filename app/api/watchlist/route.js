import connectMongo from "../../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongo();

    const user = await User.findOne().lean(); 
    return NextResponse.json({ watchlist: user?.watchlist || [] });
  } catch (err) {
    console.error("watchlist GET error:", err);
    return NextResponse.json({ watchlist: [] });
  }
}

export async function POST(req) {
  try {
    await connectMongo();

    // ✅ READ ONCE
    const body = await req.json();
    const { userId, symbol, companyName, imageUrl } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const exists = user.watchlist.some((w) => w.symbol === symbol);

    if (!exists) {
      user.watchlist.push({
        symbol: symbol.toUpperCase(),
        companyName,
        imageUrl,
      });
      await user.save();
    }

    return NextResponse.json({
      success: true,
      watchlist: user.watchlist,
    });

  } catch (err) {
    console.log("POST error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectMongo();

    const body = await req.json();
    const { userId, symbol } = body;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.watchlist = user.watchlist.filter(item => item.symbol !== symbol);
    await user.save();

    return NextResponse.json({
      success: true,
      watchlist: user.watchlist,
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
