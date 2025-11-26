import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET() {
  try {
    // Ensure connection to MongoDB
    await dbConnect();

    // Fetch top 10 users by virtualBalance (highest first)
    const leaders = await User.find({}, "name virtualBalance profileImage")
      .sort({ virtualBalance: -1 })
      .limit(10)
      .lean(); // lean() returns plain JS objects instead of Mongoose docs

    // Return array directly
    return Response.json(leaders);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
