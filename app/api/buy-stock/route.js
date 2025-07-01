import { NextResponse } from 'next/server';
import connectMongo from '../../../lib/mongodb';
import User from '../../../models/User';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { clerkId, symbol, qty, price, orderType = 'MARKET' } = await request.json();

    // Validate input
    if (!clerkId || !symbol || !qty || !price) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (qty <= 0 || price <= 0) {
      return NextResponse.json(
        { message: 'Quantity and price must be positive' },
        { status: 400 }
      );
    }

    await connectMongo();

    // Find user
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate total cost
    const totalCost = qty * price;

    // Check if user has sufficient balance
    if (user.virtualBalance < totalCost) {
      return NextResponse.json(
        { message: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = uuidv4();

    // Create trade record
    const newTrade = {
      orderId,
      symbol: symbol.toUpperCase(),
      qty,
      price,
      side: 'BUY',
      orderType,
      status: 'FILLED',
      ts: new Date()
    };

    // Update or create holding
    const existingHoldingIndex = user.holdings.findIndex(
      holding => holding.symbol === symbol.toUpperCase()
    );

    if (existingHoldingIndex >= 0) {
      // Update existing holding - FIXED: Update properties directly instead of spreading
      const existingHolding = user.holdings[existingHoldingIndex];
      const totalQty = existingHolding.qty + qty;
      const totalValue = (existingHolding.qty * existingHolding.avgCost) + (qty * price);
      const newAvgCost = totalValue / totalQty;

      // Update properties directly on the existing subdocument
      user.holdings[existingHoldingIndex].qty = totalQty;
      user.holdings[existingHoldingIndex].avgCost = newAvgCost;
      user.holdings[existingHoldingIndex].lastUpdated = new Date();
    } else {
      // Create new holding
      user.holdings.push({
        symbol: symbol.toUpperCase(),
        qty,
        avgCost: price,
        exchange: 'NSE',
        lastUpdated: new Date()
      });
    }

    // Add trade to user's trades
    user.trades.push(newTrade);

    // Deduct balance
    user.virtualBalance -= totalCost;
    user.updatedAt = new Date();

    // Save user
    await user.save();

    return NextResponse.json({
      message: 'Stock purchased successfully',
      trade: newTrade,
      newBalance: user.virtualBalance,
      orderId
    });

  } catch (error) {
    console.error('Buy stock error:', error);
    console.error('Error details:', error.errors); // This will show validation details
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}