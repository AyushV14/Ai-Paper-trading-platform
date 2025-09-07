// app/api/users/[clerkId]/route.js
import connectMongo from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function GET(req, { params }) {
  try {
    await connectMongo();
    const { clerkId } = await params; // Await the params object
    
    const user = await User.findOne({ clerkId });
    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    return Response.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return new Response("Internal server error", { status: 500 });
  }
}