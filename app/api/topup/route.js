import { NextResponse } from 'next/server';
import connectMongo from '../../../lib/mongodb';
import User from '../../../models/User';

export async function POST(request) {
  try {
    const { clerkId, amount } = await request.json();

    // Validate input
    if (!clerkId || !amount) {
      return NextResponse.json(
        { message: 'ClerkId and amount are required' },
        { status: 400 }
      );
    }

    // Validate amount is one of the allowed values
    const allowedAmounts = [10000, 20000, 50000];
    if (!allowedAmounts.includes(amount)) {
      return NextResponse.json(
        { message: 'Invalid topup amount' },
        { status: 400 }
      );
    }

    await connectMongo();

    // Find user and update virtual balance
    const user = await User.findOneAndUpdate(
      { clerkId },
      { 
        $inc: { virtualBalance: amount },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Topup successful',
      user: {
        clerkId: user.clerkId,
        virtualBalance: user.virtualBalance,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Topup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}