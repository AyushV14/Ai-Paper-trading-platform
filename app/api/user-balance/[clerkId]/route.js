import { NextResponse } from 'next/server';
import connectMongo from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function GET(request, { params }) {
  try {
    const { clerkId } = await params;

    if (!clerkId) {
      return NextResponse.json(
        { message: 'ClerkId is required' },
        { status: 400 }
      );
    }

    await connectMongo();

    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      clerkId: user.clerkId,
      virtualBalance: user.virtualBalance,
      updatedAt: user.updatedAt
    });

  } catch (error) {
    console.error('Get user balance error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}