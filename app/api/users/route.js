// app/api/users/route.js
import connectMongo from "../../../lib/mongodb";
import User from "../../../models/User";

export async function POST(req) {
  await connectMongo();
  const body = await req.json();

  try {
    const user = await User.findOneAndUpdate(
      { clerkId: body.clerkId },
      {
        $set: {
          email: body.email,
          name: body.name || "",
          profileImage: body.profileImage || "",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          virtualBalance: 100000,
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    // console.log("User synced:", user); 

    return Response.json({ user });
  } catch (error) {
    console.error("Error syncing user:", error);
    return new Response("Failed to sync user", { status: 500 });
  }
}
